/* This EA sends signals from MT account into RAMM strategy*/
#define EAVersion "2.18"
#property version EAVersion

string StrategyName = "<strategy_name>";
string Token = "<strategy_token>";
string protocol = "<api_protocol>";
string host = "<api_host>";
string path = "/api/trading/v1/signals.send";
bool MarketOnly = true; //Copy only market orders
string AppToken = "be1dbecb-cb4e-4c79-82de-7ba875bf440e";
input bool UseSymCoeff = false; //Use individual symbol coefficients?
bool EnableBalanceSynch = true;
double MinDiffPercent =  3; //minimum balance change in % to synchronize
string PostFixes = "micro;_i;.mm;.zm;.de;.ie;.a;.z;.e;.m;.f;.;k;m;f;c;w;e"; // List of symbol postfixes to drop. For example, "EURUSD.z"="EURUSD". Postfixes are separated by ';'
                                                         // List of postfixes should start with the longest and end with the shortest one
int SleepTime = 100; // Delay, ms 
int NormalHeartBeatTimeOut = 60; //in seconds, 0=no heartbeats
int AfterSignalHeartBeatTimeOut = 5; //in seconds, 0=no heartbeats
bool IsPosListChanged = false;
datetime NextHeartBeat;
datetime LastHeartBeat;
int LastTryTimeout = 10; //To avoid order duplication don't try again in less than this number of seconds 
long RAMM_Curr_MT_Account = 0;
datetime last_bal_op=0, prev_last_bal_op=0;
double Yield      = 0;
int Accounts      = 0;
int Status        = 0;
int NeedSync      = 0;
int UpdImportance = 0;
string AssetName  = "";
string CurVersion = "";
string NewVersion = "";
double AccEquity = 0;
double AccMargin = 0;
double Factor = 0;
double ProfitBase = 0;
datetime MCReached = 0;
double Protection = 0;
double ProtEq = 0;
datetime ProtReached = 0;
double Target = 0;
double TargetEquity = 0;
datetime TargetReached = 0;

struct Position
{
	ulong ticket;
	string symbol;
	long type;
	double lots;    
	double openprice;              
	double sl;
	double tp;
	long magic_number;
};

struct Signal
{
	ulong ticket;
	string symbol;
	long type; //0-BUY, 1-SELL, 2-BUY LIMIT, 3-SELL LIMIT, 4-BUY STOP, 5-SELL STOP, 6-CLOSE, 7-CANCEL, 8-MODIFY POSITION, 9-MODIFY PENDING, 10-MODIFY SL, 11-MODIFY TP
	double traderlot; 
	double part_coeff; 
	double share;     
	double openprice;            
	double sl;
	double tp;
	long magic_number; //unused, reserved for future developments
};

struct Retries
{  
	string symbol;
	datetime lasttry;
};

Retries RetryArray[];
Position PosArray[],NewPosArray[],NetPosArray[];
Signal SignalArray[],NetSignalArray[];

int OnInit()
{  
   Comment("");
   EventSetMillisecondTimer(SleepTime);  
   if (IsOtherCopyActive()) 
   {
      Message("Another copy of the EA is already working! Aborting; " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
      return(INIT_FAILED);
   }
	Message("Start at "+TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));   
	if (UseSymCoeff)
	{
   	int SymTotal = SymbolsTotal(true);
   	for (int k=0;k<SymTotal;k++)
   	{
         if (!GlobalVariableCheck("RAMM_SYM_"+SymbolName(k,true))) 
         {
            GlobalVariableSet("RAMM_SYM_"+SymbolName(k,true),1);
         }
   	}	
	}  
	while (AccountInfoDouble(ACCOUNT_BALANCE)<=0)
	{
		Message("MT account empty or not connected! " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		Sleep(SleepTime);
	} 
	RAMM_Curr_MT_Account = AccountInfoInteger(ACCOUNT_LOGIN);
	SendHeartBeat();
	NextHeartBeat = TimeLocal()+NormalHeartBeatTimeOut;
	if (Synchronize(0)) 
	{
	   NextHeartBeat = TimeLocal()+AfterSignalHeartBeatTimeOut;
		Print("Synchronization successful at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
	}	
	else  
	{  
		Print("Synchronization failed at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return(INIT_FAILED);
	}       
   return(INIT_SUCCEEDED);
}
//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                         |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   return;
}

datetime RAMM_StrToTime(string strtime)
{
   string tmpTimeYear  = StringSubstr(strtime,0,4);	
   string tmpTimeMonth = StringSubstr(strtime,5,2);
   string tmpTimeDay   = StringSubstr(strtime,8,2);		
   string tmpTimeHour  = StringSubstr(strtime,11,5);	
   return (StringToTime(tmpTimeYear+"."+tmpTimeMonth+"."+tmpTimeDay+" "+tmpTimeHour));
}
 
bool SelectSym(const string Sym) 
{
   long is_select = SymbolInfoInteger(Sym,SYMBOL_SELECT);
   if (is_select == 0) 
   {
      if(!SymbolSelect(Sym, true)) return(false);
   }   
   else return(true);
   double ask = SymbolInfoDouble(Sym,SYMBOL_ASK);
   long cnt = 0;
   while (ask == 0 && cnt < 1000)
   {  
      Sleep(10);
      ask = SymbolInfoDouble(Sym,SYMBOL_ASK);
      cnt++;
   } 
   if (ask == 0) return(false);
   else          return(true);
}
  
bool ConvertToUSD(const string CurrFrom,const bool IsRoundUP, const double AmtFrom, double& AmtUSD)
{
   if (CurrFrom == "USD") 
   {
      AmtUSD = AmtFrom;
      return(true);   
   }
   if (SelectSym(CurrFrom+"USD"))
   {
      double quote;
      if (IsRoundUP)
         quote = SymbolInfoDouble(CurrFrom+"USD",SYMBOL_ASK);
      else 
         quote = SymbolInfoDouble(CurrFrom+"USD",SYMBOL_BID);
      if (quote == 0) return(false);
      AmtUSD = AmtFrom * quote;   
      return(true);
   }
   else if (SelectSym("USD"+CurrFrom))
   {
      double quote;
      if (IsRoundUP)
         quote = SymbolInfoDouble("USD"+CurrFrom,SYMBOL_BID);
      else 
         quote = SymbolInfoDouble("USD"+CurrFrom,SYMBOL_ASK);
      if (quote == 0) return(false);   
      AmtUSD = AmtFrom / quote;     
      return(true);
   }
   else 
   {
      AmtUSD = 0;
      return(false);   
   }   
}  

ulong GetLastTrade(string Sym)
{
   HistorySelect(TimeCurrent()-3600,TimeCurrent());     
   int deal_total = HistoryDealsTotal();  
   ulong deal=0;  
   for (int k=0;k<=deal_total-1;k++)
   {   
      ulong deal_ticket = HistoryDealGetTicket(k);
      string deal_sym = HistoryDealGetString(deal_ticket,DEAL_SYMBOL);
      string tstr = StringSubstr(deal_sym,0,StringLen(Sym));
      if (tstr == Sym && deal_ticket > deal) deal = deal_ticket;
   }    
   return(deal);
}

double GetSymCoeff(string Sym)  
{
  	if (UseSymCoeff)
	{
      if (!GlobalVariableCheck("RAMM_SYM_"+Sym)) 
      {
         GlobalVariableSet("RAMM_SYM_"+Sym,1);
         return 1;
      }
      else
      {
         double tmpCoeff = GlobalVariableGet("RAMM_SYM_"+Sym);
         if (tmpCoeff<=0)
         {
            Message("Wrong symbol coefficient set for symbol "+Sym+". It should be >0."); 
            return 1;
         }
         else return(tmpCoeff);  
      }
   }   
   return 1;
}

bool SendSignalJSON(Signal &SignalTable[], const int s_type)
{
	uchar   data[];
	int pos=0;
	string header;
	string str;
	double AccEq = GetAccEquityUSD();
	if (AccEq<0) 
	{
	   Comment("No quotes for deposit currency, can't send signal");
	   return(false);
	}	
	
	header="Content-Type:application/json";
	header+="\r\nToken:"+Token;
	header+="\r\nAppToken:"+AppToken;
	
	
	str="{\"Type\":"+IntegerToString(s_type);
	pos+=StringToCharArray(str,data,pos,StringLen(str)); 
	
	if (s_type==1)
	{            
			str=",\"Symbol\":\""+SignalTable[0].symbol+"\"";
			pos+=StringToCharArray(str,data,pos,StringLen(str));                           
			str=",\"Lot\":"+DoubleToString(SignalTable[0].traderlot*GetSymCoeff(SignalTable[0].symbol));
			pos+=StringToCharArray(str,data,pos,StringLen(str));  		
		   str=",\"Equity\":"+DoubleToString(AccEq);
			pos+=StringToCharArray(str,data,pos,StringLen(str));   		
		   str=",\"Ticket\":\""+IntegerToString(GetLastTrade(SignalTable[0].symbol))+"\"";
			pos+=StringToCharArray(str,data,pos,StringLen(str));   	
		   str=",\"Comment\":\""+IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN))+"\"";
			pos+=StringToCharArray(str,data,pos,StringLen(str));   									                              
	}
	if (s_type==2 || s_type==3)
	{
		str=",\"Signals\":[";
		pos+=StringToCharArray(str,data,pos,StringLen(str)); 
		
		for (int j=0;j<ArraySize(SignalTable);j++)	  
		{  
			if (j>0)
				str=",{";
			else 
				str="{";
			pos+=StringToCharArray(str,data,pos,StringLen(str));              
			str="\"Symbol\":\""+SignalTable[j].symbol+"\"";
			pos+=StringToCharArray(str,data,pos,StringLen(str));                           
			str=",\"Lot\":"+DoubleToString(SignalTable[j].traderlot*GetSymCoeff(SignalTable[0].symbol));
			pos+=StringToCharArray(str,data,pos,StringLen(str)); 	
		   str=",\"Equity\":"+DoubleToString(AccEq);
			pos+=StringToCharArray(str,data,pos,StringLen(str));   					
			str="}";
			pos+=StringToCharArray(str,data,pos,StringLen(str));                                   
		} 
		str="]";
		pos+=StringToCharArray(str,data,pos,StringLen(str)); 	
	   str=",\"Comment\":\""+IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN))+"\"";
		pos+=StringToCharArray(str,data,pos,StringLen(str));   	     
	}	
	else if (s_type==0)
	{
   	str=",\"GetInfo\":1";
   	pos+=StringToCharArray(str,data,pos,StringLen(str));		
	}
	str="}";
	pos+=StringToCharArray(str,data,pos,StringLen(str));             
	
	str=CharArrayToString(data);
	if (s_type != 0) Print(str);
   string url = protocol+host+path;
	int res=WebRequest("POST",url,header,30000,data,data,str);
	//string res_str = CharArrayToString(data);   	
	if(res!=200) 
	{
	   int LError=GetLastError();
	   if (LError==4014) Message("URL not allowed! Add "+url+" to the list in upper menu, section Tools->Options->Expert Advisers, and check 'Allow Web-Request for listed URL'"); 	
	   else if (res==400) Message("Syntax error or unsupported instrument."); 		   
	   else if (res==401) {Message("Unautorized. Token "+Token+" is invalid"); ExpertRemove();}
	   else if (res==404) Message("Instrument not found."); 
	   else Message("Web Request sending result #"+(string)res+", LastError="+(string)LError); 
	   return(false);
	}  		
	else  
	{	   		 
		if (s_type == 0)
		{
		   //Message("Signal sent OK at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
   		string res_str = CharArrayToString(data);		
         int tmp_pos1   = StringFind(res_str,"\"CurrentVersion\":\"",0);
         if (tmp_pos1<0) return(false);
         int tmp_pos2   = StringFind(res_str,"\"NewestVersion\":\"",tmp_pos1+1);
         int tmp_pos3   = StringFind(res_str,"\"UpdateImportance\":",tmp_pos2+1);
         int tmp_pos4   = StringFind(res_str,"\"Yield\":",tmp_pos3+1);
         int tmp_pos5   = StringFind(res_str,"\"Accounts\":",tmp_pos4+1);
         int tmp_pos6   = StringFind(res_str,"\"Status\":",tmp_pos5+1);
         int tmp_pos7   = StringFind(res_str,"\"NeedSync\":",tmp_pos6+1);
         int tmp_pos8   = StringFind(res_str,"\"Equity\":",tmp_pos7+1);
         int tmp_pos9   = StringFind(res_str,"\"Margin\":",tmp_pos8+1);
         int tmp_pos10  = StringFind(res_str,"\"Factor\":",tmp_pos9+1);
         int tmp_pos11  = StringFind(res_str,"\"ProfitBase\":",tmp_pos10+1);
         int tmp_pos12  = StringFind(res_str,"\"MCReached\":",tmp_pos11+1);
         int tmp_pos13  = StringFind(res_str,"\"Protection\":",(tmp_pos12>=0)?tmp_pos12:tmp_pos11+1);
         int tmp_pos14  = StringFind(res_str,"\"ProtectionEquity\":",tmp_pos13+1);       
         int tmp_pos15  = StringFind(res_str,"\"ProtectionReached\":",tmp_pos14+1);
         int tmp_pos16  = StringFind(res_str,"\"Target\":",(tmp_pos15>=0)?tmp_pos15:tmp_pos14+1);
         int tmp_pos17  = StringFind(res_str,"\"TargetEquity\":",tmp_pos16+1);
         int tmp_pos18  = StringFind(res_str,"\"TargetReached\":",tmp_pos17+1);             
         int tmp_pos19  = StringFind(res_str,"\"Asset\":",(tmp_pos18>=0)?tmp_pos18:tmp_pos17+1);             
         int tmp_pos20  = StringFind(res_str,"}",tmp_pos19+1);
         CurVersion     =                      StringSubstr(res_str,tmp_pos1+18,tmp_pos2-tmp_pos1-20);
         NewVersion     =                      StringSubstr(res_str,tmp_pos2+17,tmp_pos3-tmp_pos2-19);
         UpdImportance  = (int)StringToInteger(StringSubstr(res_str,tmp_pos3+19,tmp_pos4-tmp_pos3-33));         
         Yield          =      StringToDouble (StringSubstr(res_str,tmp_pos4+8 ,tmp_pos5-tmp_pos4-9));
         Accounts       = (int)StringToInteger(StringSubstr(res_str,tmp_pos5+11,tmp_pos6-tmp_pos5-12));
         Status         = (int)StringToInteger(StringSubstr(res_str,tmp_pos6+9 ,tmp_pos7-tmp_pos6-10));
         if (StringSubstr(res_str,tmp_pos7+11,tmp_pos8-tmp_pos7-24) == "1") NeedSync = 1;
         else if (StringSubstr(res_str,tmp_pos7+11,tmp_pos8-tmp_pos7-24) == "2") NeedSync = 2;
         else NeedSync = 0;
         AccEquity      =      StringToDouble (StringSubstr(res_str,tmp_pos8+9,tmp_pos9-tmp_pos8-10));
         AccMargin      =      StringToDouble (StringSubstr(res_str,tmp_pos9+9 ,tmp_pos10-tmp_pos9-10));
         Factor         =      StringToDouble (StringSubstr(res_str,tmp_pos10+9,tmp_pos11-tmp_pos10-10));  
         if (tmp_pos12 >= 0)
         {
            ProfitBase     =      StringToDouble (StringSubstr(res_str,tmp_pos11+13,tmp_pos12-tmp_pos11-14));
            MCReached     =      RAMM_StrToTime (StringSubstr(res_str,tmp_pos12+13,tmp_pos13-tmp_pos12-15));   
         } 
         else 
         {
            ProfitBase     =      StringToDouble (StringSubstr(res_str,tmp_pos11+13,tmp_pos13-tmp_pos11-14));  
            MCReached      = 0;       
         }
         Protection     =      StringToDouble (StringSubstr(res_str,tmp_pos13+13,tmp_pos14-tmp_pos13-14));
         if (tmp_pos15 >= 0) 
         {   
            ProtEq         =      StringToDouble (StringSubstr(res_str,tmp_pos14+19,tmp_pos15-tmp_pos14-20));         
            ProtReached   =      RAMM_StrToTime (StringSubstr(res_str,tmp_pos15+21,tmp_pos16-tmp_pos15-23));
         }
         else 
         {
            ProtEq         =      StringToDouble (StringSubstr(res_str,tmp_pos14+19,tmp_pos16-tmp_pos14-20));
            ProtReached = 0;      
         } 
         Target         =      StringToDouble (StringSubstr(res_str,tmp_pos16+9,tmp_pos17-tmp_pos16-10));                       
         if (tmp_pos18 >= 0)  
         {  
            TargetEquity   =      StringToDouble (StringSubstr(res_str,tmp_pos17+15,tmp_pos18-tmp_pos17-16));    
            TargetReached =      RAMM_StrToTime (StringSubstr(res_str,tmp_pos18+17,tmp_pos19-tmp_pos18-18));
         }
         else
         {
            TargetEquity   =      StringToDouble (StringSubstr(res_str,tmp_pos17+15,tmp_pos19-tmp_pos17-15));
            TargetReached = 0;
         }  
         AssetName         =                      StringSubstr(res_str,tmp_pos19+9,tmp_pos20-tmp_pos19-10);
      }	
		else if (s_type == 1)
		{		   
   		string res_str = CharArrayToString(data);		
         int tmp_pos1   = StringFind(res_str,"SignalID\": ",0);
         int tmp_pos2   = StringFind(res_str,"}",tmp_pos1+1);		
         int SID = (int)StringToInteger(StringSubstr(res_str,tmp_pos1+11,tmp_pos2-tmp_pos1-12));
		   Message("Signal sent OK at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS) + "\r\nSignal #" + IntegerToString(SID));	                  
		}
		else 
		{
		   Message("Signal sent OK at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		}
	   return(true);  
	}
	return(true);
}

bool Synchronize(const int synch_type) //0-hard, 1-soft
{
   Position tmpPosArray[],tmpNetPosArray[];
   Signal tmpSignalArray[];

   if (GlobalVariableCheck("RAMM_Synch")) 
   {
      double IsSynch = GlobalVariableGet("RAMM_Synch");
      if (IsSynch==0) return(true);
   }
	int ptotal=PositionsTotal();
   ArrayResize(tmpPosArray,ptotal);
   ArrayResize(tmpSignalArray,ptotal);  
	ArrayResize(tmpNetPosArray,0);
	int S1 = 0;
	    
	double acc_equity = AccountInfoDouble(ACCOUNT_EQUITY);
	
	if (acc_equity<=0)
	{
		Message("Account equity = 0 at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return(false);
	}	   
	
	for (int j=0;j<ptotal;j++)	  //positions
	{
		string sym5    =  PositionGetSymbol(j);	   				
		ulong FTicket  =  PositionGetTicket(j);
		long ord_type  =  PositionGetInteger(POSITION_TYPE);	
		string RAMM_pos_symbol = CutChartSymbol(sym5);
		int    RAMM_sym_dig    = GetSymbolDigits(RAMM_pos_symbol);     
		double OOP  = PositionGetDouble(POSITION_PRICE_OPEN); 
		double OS   = PositionGetDouble(POSITION_SL);         
		double OT   = PositionGetDouble(POSITION_TP);  			  
		double ovol = PositionGetDouble(POSITION_VOLUME); 	
		long   MN   = PositionGetInteger(POSITION_MAGIC);		              			

		tmpPosArray[j].ticket       = FTicket;
		tmpPosArray[j].symbol       = sym5;
		tmpPosArray[j].type         = ord_type;
		tmpPosArray[j].lots         = ovol;    
		tmpPosArray[j].openprice    = OOP;              
		tmpPosArray[j].sl           = OS;
		tmpPosArray[j].tp           = OT;
		tmpPosArray[j].magic_number = MN;
      if (AccountInfoInteger(ACCOUNT_MARGIN_MODE)==ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
      {
         bool IsFound = false;
         for(int i=0; i<S1; i++)                                               
         {
            if(sym5 == tmpNetPosArray[i].symbol) 
            {
               if (ord_type == 0) tmpNetPosArray[i].lots += ovol;
               else               tmpNetPosArray[i].lots -= ovol;               
               IsFound = true;
               break;
            }                               
         }
         if (!IsFound)
         {
            ArrayResize(tmpNetPosArray,S1+1);
            tmpNetPosArray[S1].symbol = sym5;
            if (ord_type == 0) tmpNetPosArray[S1].lots = ovol;
            else               tmpNetPosArray[S1].lots = -ovol;
            S1++;
         }
		}
      else
      {
         tmpSignalArray[j].traderlot    = tmpPosArray[j].lots; 		
   		if (ord_type == 1) tmpSignalArray[j].traderlot*=-1;                                                                                                             		
   		tmpSignalArray[j].part_coeff   = 0;			
   		tmpSignalArray[j].ticket       = FTicket;
   		tmpSignalArray[j].symbol       = RAMM_pos_symbol;
   		tmpSignalArray[j].type         = ord_type;       
   		tmpSignalArray[j].openprice    = NormalizeDouble(OOP,RAMM_sym_dig);              
   		tmpSignalArray[j].sl           = NormalizeDouble(OS,RAMM_sym_dig);
   		tmpSignalArray[j].tp           = NormalizeDouble(OT,RAMM_sym_dig);      
   		tmpSignalArray[j].magic_number = MN; 
		}      
	}
   if (AccountInfoInteger(ACCOUNT_MARGIN_MODE)==ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
   {	
      int S=0; 	
   	for (int j=0;j<S1;j++)	  
   	{	
   		string RAMM_pos_symbol = CutChartSymbol(tmpNetPosArray[j].symbol);	 
   		S++;
   		ArrayResize(tmpSignalArray,S);
   		tmpSignalArray[S-1].traderlot    = tmpNetPosArray[j].lots;
   	   tmpSignalArray[S-1].part_coeff   = 0;			
   		tmpSignalArray[S-1].ticket       = 0;
   		tmpSignalArray[S-1].symbol       = RAMM_pos_symbol;
   		tmpSignalArray[S-1].type         = 0;       
   		tmpSignalArray[S-1].openprice    = 0;              
   		tmpSignalArray[S-1].sl           = 0;
   		tmpSignalArray[S-1].tp           = 0;      
   		tmpSignalArray[S-1].magic_number = 0;     	
   	}	
   }
		
	int api_synchtype = 3; //hard
	if (synch_type == 1) api_synchtype =2; //soft
	if (!SendSignalJSON(tmpSignalArray,api_synchtype)) 
	{
		return(false);
	}    
	else 
	{
	   NextHeartBeat = TimeLocal()+AfterSignalHeartBeatTimeOut;
	   prev_last_bal_op = last_bal_op;
	   if (api_synchtype == 3) //hard
	   {
			ArrayResize(PosArray,ArraySize(tmpPosArray));
			for (int j=0;j<ArraySize(PosArray);j++)	  
			{                
				PosArray[j].ticket       = tmpPosArray[j].ticket;
				PosArray[j].symbol       = tmpPosArray[j].symbol;
				PosArray[j].type         = tmpPosArray[j].type;
				PosArray[j].lots         = tmpPosArray[j].lots;
				PosArray[j].openprice    = tmpPosArray[j].openprice;
				PosArray[j].sl           = tmpPosArray[j].sl;
				PosArray[j].tp           = tmpPosArray[j].tp;  
				PosArray[j].magic_number = tmpPosArray[j].magic_number;                    
			} 	      
	   }	   
		return(true);
	}	
}

bool SendHeartBeat()
{   
	if (!SendSignalJSON(SignalArray,0)) 
	{
		Comment("Error web-sending HeartBeat " + " at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return(false);
	}    
	else 
	{ 
	//   Message("HeartBeat sent Ok" + " at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
	   LastHeartBeat = TimeLocal();
		return(true);
	}	
}

bool IsOtherCopyActive()
{
   if (!GlobalVariableCheck("RAMM_Ch_ID_"+Token)) 
   {
      long ChId = ChartID();
      double dChId = ChId-100000000*MathFloor((double)ChId/100000000);
      GlobalVariableTemp("RAMM_Ch_ID_"+Token);
      GlobalVariableSet("RAMM_Ch_ID_"+Token,dChId);
      GlobalVariableTemp("RAMM_LAccess_"+Token);
      GlobalVariableSet("RAMM_LAccess_"+Token,(double)TimeLocal());   
      return(false);
   }
   else 
   {
      double   VarChID       = GlobalVariableGet("RAMM_Ch_ID_"+Token);
      long ChId              = ChartID();
      double  tmp1 = 100000000*MathFloor((double)ChId/100000000);
      long    tmp2 = ChId - (long)tmp1;  
      double   LocalChID     = (double)tmp2;     
      datetime LastChartTime = (datetime)GlobalVariableGet("RAMM_LAccess_"+Token);
      datetime LocalT        = TimeLocal();
      if (VarChID!=LocalChID && (LocalT-LastChartTime)*1000 < SleepTime*100) //there is already another active copy of the EA
      {         
         return(true);
      }
      else //no ACTIVE copies detected
      {
         GlobalVariableSet("RAMM_Ch_ID_"+Token,LocalChID);
         GlobalVariableSet("RAMM_LAccess_"+Token,(double)TimeLocal());
         return(false);
      }      
   }
}

bool IsAccountChanged()
{
   if (RAMM_Curr_MT_Account == AccountInfoInteger(ACCOUNT_LOGIN)) return(false);
   else                                                           return(true);
}

double GetAccEquityUSD()
{
   string dep_sym = AccountInfoString(ACCOUNT_CURRENCY);
   string SymName1 = dep_sym + "USD";
   string SymName2 = "USD" + dep_sym;
   double FXBidAsk1 = 0;
   double FXBidAsk2 = 0;
   double acc_eq_curdep = AccountInfoDouble(ACCOUNT_EQUITY);
   double acc_eq_usd = -1;
   if (dep_sym == "USD") acc_eq_usd = acc_eq_curdep; 
   else if (SymbolSelect(SymName1, true))
   { 
      FXBidAsk1 = SymbolInfoDouble(SymName1,SYMBOL_BID);
      if (FXBidAsk1!=0) acc_eq_usd = acc_eq_curdep * FXBidAsk1;  
   }   
   else if (SymbolSelect(SymName2, true))
   {
      FXBidAsk2 = SymbolInfoDouble(SymName2,SYMBOL_ASK);
      if (FXBidAsk2!=0) acc_eq_usd = acc_eq_curdep / FXBidAsk2; 
   }   
   return(acc_eq_usd);
}

void OnTimer()
{     	
	if (IsAccountChanged()) 
	{
		Comment("MT Account changed! To continue return to Account #"+IntegerToString(RAMM_Curr_MT_Account)+" or restart EA! " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return;
	}		
	if (UpdImportance >= 5) 
	{
		Comment("Critical Update required! To continue download and install new version of EA! " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return;
	}			
   long ChId = ChartID();
   double  tmp1 = 100000000*MathFloor((double)ChId/100000000);
   long    tmp2 = ChId - (long)tmp1;  
   double   LocalChID     = (double)tmp2;     
	GlobalVariableSet("RAMM_Ch_ID_"+Token,LocalChID);
   GlobalVariableSet("RAMM_LAccess_"+Token,(double)TimeLocal()); 	
	if (AccountInfoDouble(ACCOUNT_EQUITY)<=0) 
	{
		Comment("MT account empty or not connected! " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return;
	}

	int total=0;

	if(!TerminalInfoInteger(TERMINAL_CONNECTED))
	{
		Comment("No connection to MT server; " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		return;
	}	
	string CommString = "Waiting for signal; " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS);
	if (CurVersion!="")
	{	
   	CommString += "\r\nLast Info Update: "+TimeToString(LastHeartBeat,TIME_DATE|TIME_SECONDS);
   	CommString += "\r\n--- Expert Advisor ---";
   	CommString += "\r\nCurrent Version: "+CurVersion;
   	CommString += "\r\nNewest Version: "+NewVersion;	
   	string tmpstring = "Unknown";
   	switch(UpdImportance) 
      { 
         case 1: tmpstring = "minor"; break;
         case 2: tmpstring = "standard"; break;
         case 3: tmpstring = "IMPORTANT"; break;
         case 4: tmpstring = "VERY IMPORTANT"; break;
         case 5: tmpstring = "!!! CRITICAL !!!"; break;
      } 	
   	if (UpdImportance > 0) CommString += "\r\nUpdate Importance: "+tmpstring; 	
   	CommString += "\r\n--- Strategy ---";	
   	CommString += "\r\nName: "+StrategyName;	
   	tmpstring = "Unknown";
   	switch(Status) 
      { 
         case 0: tmpstring = "Not activated yet"; break;
         case 1: tmpstring = "Ok"; break;
         case 2: tmpstring = "PAUSED"; break;
         case 3: tmpstring = "DISABLED"; break;
         case 4: tmpstring = "CLOSED"; break;
      } 
   	CommString += "\r\nStatus: "+tmpstring;	
   	CommString += "\r\nYield: "+DoubleToString(Yield*100,2)+"%";
   	CommString += "\r\nAccounts: "+IntegerToString(Accounts);
   	CommString += "\r\n--- Account ---";	
   	CommString += "\r\nEquity: "+DoubleToString(AccEquity,2)+" "+AssetName;
   	CommString += "\r\nInterval PnL: "+DoubleToString(AccEquity-ProfitBase,2)+" "+AssetName;	
   	CommString += "\r\nMargin: "+DoubleToString(AccMargin,2)+" "+AssetName;
      if (AccMargin > 0) CommString += "\r\nMarginLevel: "+DoubleToString(AccEquity/AccMargin*100,2)+"%";
   	if (MCReached > 0)
   	   CommString += "\r\nMCReached: "+TimeToString(MCReached)+" UTC";
   	CommString += "\r\nTarget: "+DoubleToString(Target*100,2)+"% ("+DoubleToString(TargetEquity,2)+" "+AssetName+")";
   	if (TargetReached > 0)	
   	CommString += "\r\nTarget Reached: "+TimeToString(TargetReached)+" UTC";  	   
   	CommString += "\r\nProtection: "+DoubleToString(Protection*100,2)+"% ("+DoubleToString(ProtEq,2)+" "+AssetName+")";
   	if (ProtReached > 0)	
   	CommString += "\r\nProtection Reached: "+TimeToString(ProtReached)+" UTC";
   }	                           
	Comment(CommString);		
	if (Status == 4) {ExpertRemove();return;}

	if (EnableBalanceSynch)
	{
	   double Balance_Change = 0;
	   double Equity = AccountInfoDouble(ACCOUNT_EQUITY);	
	   datetime cur_time = TimeCurrent();
	   HistorySelect(prev_last_bal_op+1,cur_time);
      int deal_total = HistoryDealsTotal(); 
      ulong deal_ticket = 0;  
      for (int k=0;k<=deal_total-1;k++)
      {  
         deal_ticket = HistoryDealGetTicket(k);
         long deal_type = HistoryDealGetInteger(deal_ticket,DEAL_TYPE);       
         if (deal_type>=2) 
         {
            double deal_amt = HistoryDealGetDouble(deal_ticket,DEAL_PROFIT);
            Balance_Change += deal_amt;
            datetime deal_time = (datetime)HistoryDealGetInteger(deal_ticket,DEAL_TIME);
            if (deal_time > last_bal_op) last_bal_op = deal_time;
         }   
      }
      if (MathAbs(Balance_Change / (Equity - Balance_Change)) >= MinDiffPercent/100)
      {
   		if (Synchronize(0))
   			Print("Synchronization successful at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
   		else
   			Print("Synchronization failed at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
      }			    
	}	 
   if (Status == 1 && NeedSync != 0)
   {
      int synchtype=0;
      if (NeedSync == 1) synchtype = 1;
		if (Synchronize(synchtype))
		{ 
			Print("Synchronization successful at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
			NeedSync = false;
		}	
		else  
			Print("Synchronization failed at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));        
   }           
	if (NextHeartBeat > 0)
	{
		if (TimeLocal() >= NextHeartBeat) 
		{
			if (!SendHeartBeat()) 
				Comment("Error sending HeartBeat " + " at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
         NextHeartBeat = TimeLocal()+NormalHeartBeatTimeOut;	             
		}  
	}
	     
	ArrayFree(SignalArray); 
	int S=0;
	ArrayFree(NewPosArray); 
	int P=0;

   //////////////////////////////////////////////////////////////////////Deleting & modifying orders
	int pos_total = ArrayRange(PosArray,0);
	for (int k=0;k<pos_total;k++)	  /////Cycling array positions
	{       
		long pos_type=PosArray[k].type;
		ulong pos_ticket=PosArray[k].ticket;          
		long pos_magic=PosArray[k].magic_number;    
		string pos_symbol=PosArray[k].symbol; 
		string RAMM_pos_symbol=CutChartSymbol(PosArray[k].symbol); 
		int RAMM_sym_dig = GetSymbolDigits(RAMM_pos_symbol); 
		double POP=NormalizeDouble(PosArray[k].openprice,RAMM_sym_dig); 
		double POS=NormalizeDouble(PosArray[k].sl,RAMM_sym_dig); 
		double POT=NormalizeDouble(PosArray[k].tp,RAMM_sym_dig);
		double pos_lots=PosArray[k].lots;
		bool order_delete      = true;
		bool order_modify      = false;
		bool pending_activated = false;
					
		int ptotal=PositionsTotal();	
		for (int cnt=0;cnt<ptotal;cnt++)	  //////Cycling MT positions
		{
			string sym5    =  PositionGetSymbol(cnt);	   				
			ulong FTicket  =  PositionGetTicket(cnt);
			long type      =  PositionGetInteger(POSITION_TYPE);							  				    
			if (pos_ticket==FTicket) 
			{
				double OOP  = NormalizeDouble(PositionGetDouble(POSITION_PRICE_OPEN),RAMM_sym_dig); 
				double OS   = NormalizeDouble(PositionGetDouble(POSITION_SL),RAMM_sym_dig);         
				double OT   = NormalizeDouble(PositionGetDouble(POSITION_TP),RAMM_sym_dig);  
				double ovol = PositionGetDouble(POSITION_VOLUME);  
				long   MN   = PositionGetInteger(POSITION_MAGIC);
			   	  
				order_delete=false;      	        	
				   
				if (ovol!=pos_lots  && IsRetryReady(RAMM_pos_symbol))  //modify (including partial close)
				{  
				   //SetLastTryTime(RAMM_pos_symbol);  
					long ord_spread   = SymbolInfoInteger(sym5,SYMBOL_SPREAD);        
					long symb_digits  = SymbolInfoInteger(sym5,SYMBOL_DIGITS);
					double tick_value = SymbolInfoDouble( sym5,SYMBOL_TRADE_TICK_VALUE);
					double acc_equity = AccountInfoDouble(ACCOUNT_EQUITY);  
					
         		double ask           = SymbolInfoDouble( sym5,SYMBOL_ASK);
         		double bid           = SymbolInfoDouble( sym5,SYMBOL_BID); 		
         		double quote;
         		if (ovol > 0) quote = ask;
         		else quote = bid; 		
         		//Print("Eq="+DoubleToString(acc_equity)+"; Ask="+DoubleToString(ask)+"; Bid="+DoubleToString(bid));				
         		ArrayResize(SignalArray,S+1);        											 
               SignalArray[S].traderlot = ovol;
               if (type == 1) SignalArray[S].traderlot*=-1;          	                      
					SignalArray[S].magic_number = MN;
					SignalArray[S].openprice = 0;
					 
					SignalArray[S].part_coeff = 0; 
					SignalArray[S].sl = OS;
					SignalArray[S].symbol = RAMM_pos_symbol;
					SignalArray[S].ticket = FTicket;
					SignalArray[S].tp = OT;
					SignalArray[S].type = 8; //modify position
					S++;                            
					          
					ArrayResize(NewPosArray,P+1);                      
					NewPosArray[P].ticket       = FTicket;
					NewPosArray[P].symbol       = pos_symbol;
					NewPosArray[P].type         = type;
					NewPosArray[P].lots         = ovol;
					NewPosArray[P].openprice    = PositionGetDouble(POSITION_PRICE_OPEN);
					NewPosArray[P].sl           = PositionGetDouble(POSITION_SL);
					NewPosArray[P].tp           = PositionGetDouble(POSITION_TP);  
					NewPosArray[P].magic_number = pos_magic; 
					P++;  
					order_modify=true;                                  
				} 
				break;       	                                	                	     
			}
		}
		
		if (order_delete && IsRetryReady(RAMM_pos_symbol)) 
		{  
		   //SetLastTryTime(RAMM_pos_symbol);
			ArrayResize(SignalArray,S+1);                      
			SignalArray[S].magic_number = pos_magic;
			SignalArray[S].openprice = 0;
			SignalArray[S].traderlot = 0;
			SignalArray[S].part_coeff = 0;
			SignalArray[S].sl = 0;
			SignalArray[S].symbol = RAMM_pos_symbol;
			SignalArray[S].ticket = pos_ticket;
			SignalArray[S].tp = 0;         
			SignalArray[S].type = 6; //close position
			
			S++;
		} 
		else if (!order_modify && !pending_activated)
		{            
		ArrayResize(NewPosArray,P+1);                      
		NewPosArray[P].ticket       = PosArray[k].ticket;
		NewPosArray[P].symbol       = PosArray[k].symbol;
		NewPosArray[P].type         = PosArray[k].type;
		NewPosArray[P].lots         = PosArray[k].lots;
		NewPosArray[P].openprice    = PosArray[k].openprice;
		NewPosArray[P].sl           = PosArray[k].sl;
		NewPosArray[P].tp           = PosArray[k].tp;  
		NewPosArray[P].magic_number = PosArray[k].magic_number;  
		P++;
		}   	    
	}                                  
      
   //////////////////////////////////////////////////////////////////////End of deleting cycle
   
   
   //////////////////////////////////////////////////////////////////////Open new orders
  		
	int ptotal=PositionsTotal();
	for (int cnt=0;cnt<ptotal;cnt++)	  //////MT positions cycle
	{
		string sym5    =  PositionGetSymbol(cnt);	   				
		ulong FTicket  =  PositionGetTicket(cnt);
		long ord_type  =  PositionGetInteger(POSITION_TYPE);	
		string RAMM_pos_symbol = CutChartSymbol(sym5);
		int    RAMM_sym_dig    = GetSymbolDigits(RAMM_pos_symbol);     
		double OOP  = NormalizeDouble(PositionGetDouble(POSITION_PRICE_OPEN),RAMM_sym_dig); 
		double OS   = NormalizeDouble(PositionGetDouble(POSITION_SL),RAMM_sym_dig);         
		double OT   = NormalizeDouble(PositionGetDouble(POSITION_TP),RAMM_sym_dig);  			  
		double ovol = PositionGetDouble(POSITION_VOLUME); 	
		long   MN   = PositionGetInteger(POSITION_MAGIC);			   
		bool pos_found=false;
	
		int pos_ttl = ArrayRange(PosArray,0);      

		for (int k=0;k<pos_ttl;k++)	  ////Previous positions cycle
		{            
			ulong pos_ticket=PosArray[k].ticket;             
			if (pos_ticket==FTicket && ord_type==PosArray[k].type)//   if a pending order was executed, we send a new market order
			{
				pos_found=true;
				break;
			}
		}

		if (!pos_found  && IsRetryReady(RAMM_pos_symbol))
		{    
		   //SetLastTryTime(RAMM_pos_symbol);                                                                                                                                           	                  
			ArrayResize(SignalArray,S+1);     		  
   		SignalArray[S].traderlot    = ovol; 		   														 
         if (ord_type == 1) SignalArray[S].traderlot*=-1;  			                     	                				       
			SignalArray[S].magic_number = MN;
			SignalArray[S].openprice    = OOP;
			SignalArray[S].part_coeff   = 0; 
			SignalArray[S].sl           = OS;
			SignalArray[S].symbol       = RAMM_pos_symbol;
			SignalArray[S].ticket       = FTicket;
			SignalArray[S].tp           = OT; 
			SignalArray[S].type         = ord_type; 
			S++;
			   
			ArrayResize(NewPosArray,P+1);                      
			NewPosArray[P].ticket       = FTicket;
			NewPosArray[P].symbol       = sym5;
			NewPosArray[P].type         = ord_type;
			NewPosArray[P].lots         = ovol;
			NewPosArray[P].openprice    = PositionGetDouble(POSITION_PRICE_OPEN);
			NewPosArray[P].sl           = PositionGetDouble(POSITION_SL);
			NewPosArray[P].tp           = PositionGetDouble(POSITION_TP);  
			NewPosArray[P].magic_number = MN;   
			P++;                               
		}  	  
	} 
	
   if (ArraySize(SignalArray)>0)  
	{  
      if (AccountInfoInteger(ACCOUNT_MARGIN_MODE)==ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
      {
   	   int p_total=PositionsTotal();
      	ArrayResize(NetPosArray,0);
      	int S1 = 0;
      	
         for(int j=0; j<p_total; j++)
         {   
            string sym5    =  PositionGetSymbol(j); 
            long ord_type  =  PositionGetInteger(POSITION_TYPE);	 
            double ovol    =  PositionGetDouble(POSITION_VOLUME);       
            bool IsFound = false;
            for(int i=0; i<S1; i++)                                               
            {
               if(sym5 == NetPosArray[i].symbol) 
               {
                  if (ord_type == 0) NetPosArray[i].lots += ovol;
                  else               NetPosArray[i].lots -= ovol;               
                  IsFound = true;
                  break;
               }                               
            }
            if (!IsFound)
            {
               ArrayResize(NetPosArray,S1+1);
               NetPosArray[S1].symbol = sym5;
               if (ord_type == 0) NetPosArray[S1].lots = ovol;
               else               NetPosArray[S1].lots = -ovol;
               S1++;
            }
         }	
         
         ArrayResize(NetSignalArray,0);		   
         int S2=0; 	
      	for (int j=0;j<S1;j++)	//цикл по неттинговым позициям  
      	{				
   	      bool IsFound = false;
            for(int i=0; i<S; i++)   //цикл по сигналам                                            
            {
               if(SignalArray[i].symbol == CutChartSymbol(NetPosArray[j].symbol)) 
               {              
                  IsFound = true;
                  break;
               }                               
            }
            if (IsFound)
            {          		
         		string RAMM_pos_symbol = CutChartSymbol(NetPosArray[j].symbol);
         		S2++;
         		ArrayResize(NetSignalArray,S2);
         		NetSignalArray[S2-1].traderlot    = NetPosArray[j].lots;       		
         	   NetSignalArray[S2-1].part_coeff   = 0;			
         		NetSignalArray[S2-1].ticket       = 0;
         		NetSignalArray[S2-1].symbol       = RAMM_pos_symbol;
         		NetSignalArray[S2-1].type         = 0;       
         		NetSignalArray[S2-1].openprice    = 0;              
         		NetSignalArray[S2-1].sl           = 0;
         		NetSignalArray[S2-1].tp           = 0;      
         		NetSignalArray[S2-1].magic_number = 0;    
            }
      	}		  
   	  
         for (int i=0;i<S;i++)	//цикл по сигналам 
      	{				
   	      bool IsFound = false;
            for(int j=0; j<S2; j++) //цикл по неттинговым сигналам                                             
            {
               if(SignalArray[i].symbol == NetSignalArray[j].symbol) 
               {              
                  IsFound = true;
                  break;
               }                               
            }
            if (!IsFound)
            {   
               string RAMM_pos_symbol = CutChartSymbol(SignalArray[i].symbol);       		
         		S2++;
         		ArrayResize(NetSignalArray,S2);
         		NetSignalArray[S2-1].traderlot    = 0;
         	   NetSignalArray[S2-1].part_coeff   = 0;			
         		NetSignalArray[S2-1].ticket       = 0;
         		NetSignalArray[S2-1].symbol       = RAMM_pos_symbol;
         		NetSignalArray[S2-1].type         = 0;       
         		NetSignalArray[S2-1].openprice    = 0;              
         		NetSignalArray[S2-1].sl           = 0;
         		NetSignalArray[S2-1].tp           = 0;      
         		NetSignalArray[S2-1].magic_number = 0;    
            }
      	}	
      }	
		
		bool res = true;
		Signal tmpSignalArray[1];		
		if (AccountInfoInteger(ACCOUNT_MARGIN_MODE)==ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
		{
   		for (int j=0;j<ArraySize(NetSignalArray);j++)	  
   		{  
   		   tmpSignalArray[0].symbol = NetSignalArray[j].symbol;
   		   tmpSignalArray[0].traderlot = NetSignalArray[j].traderlot;
   		   bool tmpres = SendSignalJSON(tmpSignalArray,1);
   		   if (!tmpres) SetLastTryTime(NetSignalArray[j].symbol); 
   		   res = res && tmpres;
   		}  		
		}   
		else 
		{
   		for (int j=0;j<ArraySize(SignalArray);j++)	  
   		{  
   		   tmpSignalArray[0].symbol = SignalArray[j].symbol;
   		   tmpSignalArray[0].traderlot = SignalArray[j].traderlot;
   		   bool tmpres = SendSignalJSON(tmpSignalArray,1);
   		   if (!tmpres) SetLastTryTime(SignalArray[j].symbol); 
   		   res = res && tmpres;
   		}  		
		}   
		if (!res) 
			Message("Error sending  " + " at " + TimeToString(TimeLocal(),TIME_DATE|TIME_SECONDS));
		else 
		{
		   NextHeartBeat = TimeLocal()+AfterSignalHeartBeatTimeOut;	
			ArrayResize(PosArray,ArraySize(NewPosArray));
			
			for (int j=0;j<ArraySize(PosArray);j++)	  
			{                
				PosArray[j].ticket       = NewPosArray[j].ticket;
				PosArray[j].symbol       = NewPosArray[j].symbol;
				PosArray[j].type         = NewPosArray[j].type;
				PosArray[j].lots         = NewPosArray[j].lots;
				PosArray[j].openprice    = NewPosArray[j].openprice;
				PosArray[j].sl           = NewPosArray[j].sl;
				PosArray[j].tp           = NewPosArray[j].tp;  
				PosArray[j].magic_number = NewPosArray[j].magic_number;                    
			}            
		}  	
	}   
}

string CutChartSymbol(string RawSymbol)
{ 
	string PFarray[]; 
	string tmpSymbol=RawSymbol;
	int k=StringSplit(PostFixes,59,PFarray);   

	for(int i=0;i<k;i++) 
	{
		if (StringSubstr(tmpSymbol,StringLen(tmpSymbol)-StringLen(PFarray[i]),StringLen(PFarray[i]))==PFarray[i])
		{
			tmpSymbol=StringSubstr(tmpSymbol,0,StringLen(tmpSymbol)-StringLen(PFarray[i]));   
			break;
		}
	} 
   ////////////////////////////////////////////////////////////HARDCODE START
   if (tmpSymbol == "BRN") return("BRENT");
   if (tmpSymbol == "GOLD") return("XAUUSD");
   ////////////////////////////////////////////////////////////HARDCODE END  	
	return(tmpSymbol);
}

void Message(string m) 
{
	Print(StrategyName+";v."+EAVersion+"; "+m);
	Comment(StrategyName+";v."+EAVersion+"; "+m); 
}

int GetSymbolDigits(string ticker)
{
	string PredefinedSymbols = "AUDCAD;AUDCHF;AUDJPY;AUDNZD;AUDUSD;CADCHF;CADJPY;CHFJPY;EURAUD;EURCAD;EURCHF;EURGBP;EURJPY;EURNZD;EURUSD;GBPAUD;GBPCAD;GBPCHF;GBPJPY;GBPNZD;GBPUSD;NZDCAD;NZDCHF;NZDJPY;NZDUSD;USDCAD;USDCHF;USDJPY;XAGUSD;XAUUSD;BTCUSD;ETHUSD;";
	string PredefinedDigits = "55355533555535555535555355533222";     
	int sym_pos = StringFind(PredefinedSymbols,ticker+";");
	
	if (sym_pos==-1)
		return(8);
	else 
	{
		int int_pos = sym_pos/7;
		string int_char = StringSubstr(PredefinedDigits,int_pos,1);   
		int result = (int)StringToInteger(int_char);
		return(result);
	}   
}

bool IsRetryReady(string symbol)
{
	for (int j=0;j<ArraySize(RetryArray);j++)	  
	{
		if (RetryArray[j].symbol == symbol) 
		{
			if (TimeLocal()-RetryArray[j].lasttry <= LastTryTimeout)
				return(false);
			else
				return(true);    
		}
	}	
	return(true);
}

void SetLastTryTime(string symbol)
{
	bool IsFound = false;
	int ASize = ArraySize(RetryArray);
	for (int j=0;j<ASize;j++)	  
	{
		if (RetryArray[j].symbol == symbol) 
		{
			RetryArray[j].lasttry = TimeLocal();
			IsFound = true;
			break;
		}   
	}	
	if (!IsFound)
	{
		ArrayResize(RetryArray,ASize+1);
		RetryArray[ASize].symbol = symbol;
		RetryArray[ASize].lasttry = TimeLocal();
	}	
}
