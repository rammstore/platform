import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, pipe, ReplaySubject, Subject } from "rxjs";
import {
  Account,
  AccountsSearchOptions,
  ChartOptions,
  Command,
  Deal,
  DealsSearchOptions,
  Offer,
  Paginator,
  Position,
  PositionsSearchOptions,
  RatingSearchOptions,
  StrategiesSearchOptions,
  Strategy,
  StrategyAccontsOptions
} from "@app/models";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CreateInstanceService } from "@app/services/create-instance.service";
import { CommandService } from "@app/services/command.service";
import { CONFIG } from '@assets/config';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { LoaderService } from '@app/services/loader.service';
import { WalletService } from '@app/services/wallet.service';
import { Router } from '@angular/router';
import { NotificationsService } from '@app/services/notifications.service';
import { AccountSpecAsset } from '@app/models/account-spec-asset';
import { Rating } from '@app/models/rating';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  ratingsSubject: BehaviorSubject<Rating[]> = new BehaviorSubject<Rating[]>(null);
  // Мои активные стратегии
  activeMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Мои закрытые стратегии
  closedMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Мои активные инвестиции
  activeMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Мои закрытые инвестиции
  closedMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Детали текущей стратегии
  currentStrategyDetailsSubject: ReplaySubject<Strategy> = new ReplaySubject<Strategy>();
  // Рейтинг стратегий
  ratingStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Детали текущей инвестиции
  currentAccountStatementSubject: ReplaySubject<any> = new ReplaySubject<any>();
  // Инвестиции текущей стратегии
  currentStrategyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Настройки счетов клиента
  accountSpecAsset: AccountSpecAsset;
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  apiUrl: string = CONFIG.baseApiUrl;

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService,
    private commandService: CommandService,
    private loaderService: LoaderService,
    private walletService: WalletService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {
    if (!CONFIG.baseApiUrl.startsWith('http')) {
      this.apiUrl = `${window.location.origin}${CONFIG.baseApiUrl}`;
    }
  }

  //
  // Методы работы со стратегиями
  //

  // Получение списка активных стратегий
  getActiveMyStrategies(args: { paginator: Paginator }): Observable<Strategy[]> {
    this.loaderService.showLoader();
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      SearchMode: 'MyActiveStrategies'
    };

    if (args.paginator) {
      options.Pagination = {
        CurrentPage: args.paginator.currentPage,
        PerPage: args.paginator.perPage
      };
    }

    this.http.post(`${this.apiUrl}/Strategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (args.paginator) {
        args.paginator.totalItems = response.Pagination.TotalRecords;
        args.paginator.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.activeMyStrategiesSubject.next(strategies);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.activeMyStrategiesSubject.asObservable();
  }

  // Получение списка закрытых стратегий
  getClosedMyStrategies(pagination?: Paginator): Observable<Strategy[]> {
    this.loaderService.showLoader();
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      SearchMode: 'MyClosedStrategies'
    };
    options.OrderBy = {
      Field: 'DTClosed',
      Direction: 'Desc'
    };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${this.apiUrl}/Strategies.search`, options).subscribe((response: any) => {
      this.loaderService.showLoader();
      const strategies: Strategy[] = [];

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies.forEach((s: any) => {
        s.PublicOffer = s.PublicOffer || {};
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.closedMyStrategiesSubject.next(strategies);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.closedMyStrategiesSubject.asObservable();
  }

  // Получение конкретной стратегии за ID
  getStrategyByID(args: { strategyId: number }): Observable<Strategy> {
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/strategies.get`, { ID: args.strategyId })
      .subscribe((response: any) => {
        this.loaderService.hideLoader();
        this.currentStrategyDetailsSubject.next(this.createInstanceService.createStrategy(response));
      },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/rating']);
            this.notificationsService.open('notify.strategy.access.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          } else {
            this.notificationsService.open('notify.loading.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          }
        });

    return this.currentStrategyDetailsSubject.asObservable();
  }

  getStrategyById(args: { strategyId: number }): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/strategies.get`, { ID: args.strategyId })
      .pipe(
        map((item) => this.createInstanceService.createStrategy(item)),
        tap(item => this.loaderService.hideLoader()));
  }

  getStrategyByLinkAsObservable(args: { link: string }): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/strategies.get`, { Link: args.link })
      .pipe(
        map((item) => this.createInstanceService.createStrategy(item)),
        tap(item => this.loaderService.hideLoader())
      );
  }

  // getOffers(id: number): Observable<any> {
  //   this.loaderService.showLoader();
  //   return this.http.post(`${this.apiUrl}/strategies.getOffers`, { StrategyID: id })
  //     .pipe(
  //       map((offers) => this.createInstanceService.createOffers(offers)),
  //       tap(item => this.loaderService.hideLoader())
  //     );
  // }
  // Получение конкретной стратегии за ссылкой
  getStrategyByLink(args: { link: string }): Observable<Strategy> {
    // console.log('getStrategyByLink');
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/strategies.get`, { Link: args.link }).subscribe((response: any) => {
      this.loaderService.hideLoader();
      this.currentStrategyDetailsSubject.next(this.createInstanceService.createStrategy(response));
    }, (error: HttpErrorResponse) => {
      if (error.status === 404) {
        this.router.navigate(['/rating']);
        this.notificationsService.open('notify.strategy.access.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      } else {
        this.notificationsService.open('notify.loading.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      }
    });

    return this.currentStrategyDetailsSubject.asObservable();
  }

  // Создание новой стратегии
  addStrategy(strategy: object, methodName: string, methodArgs: any): Observable<Strategy> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.add`, strategy).pipe(
      map((response: any) => {
        // this.loaderService.hideLoader();
        // this.walletService.updateWallet().subscribe();
        // // this.getActiveMyStrategies().subscribe();
        // this.notificationsService.open('notify.strategy.created');
        this.updateAccount(new Command(response.AccountCommandID, response.AccountID), methodName, methodArgs, 'notify.strategy.created');

        return this.createInstanceService.createStrategy({
          ID: response.StrategyID
        });
      })
    );
  }

  setPublicOffer(strategyID: number, offerID?: number) {
    const json: any = {
      StrategyID: strategyID
    };

    if (offerID) {
      json.OfferID = offerID;
    }

    return this.http.post(`${this.apiUrl}/myStrategies.setPublicOffer`, json);
  }

  getOffers(id: number) {
    return this.http.post(`${this.apiUrl}/strategies.getOffers`, {
      StrategyID: id
    })
      .pipe(
        map((item: any) => {
          const array: Offer[] = [];

          (item.Offers || []).forEach((item: any) => {
            array.push(new Offer(item));
          });
          return array;
        }));
  }

  // Создать оферту
  addOffer(id: number, feeRate: number, commissionRate: number): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.addOffer`, {
      StrategyID: id,
      FeeRate: feeRate,
      CommissionRate: commissionRate
    }).pipe(
      map((item) => {
        //this.setPublicOffer(id, item['OfferID']).subscribe();
        return item;
      })
    );
  }

  // Постановка стратегии на паузу
  pauseStrategy(strategyId: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.pause`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        this.updateStrategy(new Command(response.CommandID, strategyId), methodName, methodArgs, 'notify.strategy.paused');
      })
    );
  }

  // Возобновление стратегии
  resumeStrategy(strategyId: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.resume`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        this.updateStrategy(new Command(response.CommandID, strategyId), methodName, methodArgs, 'notify.strategy.resumed');
      })
    );
  }

  // Закрытие стратегии
  closeStrategy(strategyId: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.close`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        this.updateStrategy(new Command(response.CommandID, strategyId), methodName, methodArgs, 'notify.strategy.closed');
      })
    );
  }

  getStrategyToken(strategyId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/myStrategies.getToken`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        return response.Token;
      })
    );
  }

  isStrategyNameUniq(searchQuery: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/myStrategies.checkName`, { Name: searchQuery }).pipe(
      map((response: any) => {
        return !!response.StrategyNameAvailable;
      })
    );
  }

  // Получение статуса команды стратегии и запрос обновленного списка стратегий после завершения обработки изменений
  // Работает с активными стратегиями, так как закрытые изменять нельзя
  updateStrategy(command: Command, methodName: string, methodArgs: any, notificationText: string): void {
    const interval = setInterval(() => {
      this.commandService.checkStrategyCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this[methodName](methodArgs)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.notificationsService.open(notificationText);
              this.destroy$.next(true);
            });
          this.walletService.updateWallet()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.destroy$.next(true);
            });
        }
      });
    }, 1000);
  }

  // Получение графика для стратегий
  getStrategyChart(chartOptions: ChartOptions): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: chartOptions.strategyID,
      MaxPoints: chartOptions.maxPoints,
      chartType: chartOptions.chartType,
      chartSize: chartOptions.chartSize
    };

    this.loaderService.hideLoader();
    return this.http.post(`${this.apiUrl}/charts.get`, options);
  }

  getSymbolsChart(strategyID: number): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: strategyID
    };

    return this.http.post(`${this.apiUrl}/strategysymbolstat.get`, options).pipe(
      map((response: any) => {
        const chart: object[] = [];
        response.StrategySymbolStat.forEach((stat: any) => {
          chart.push({ name: stat.Symbol, y: stat.Share });
        });
        this.loaderService.hideLoader();
        return chart;
      })
    );
  }

  getStrategyAccounts(strategyID: number, isActive: boolean = true, pagination?: Paginator): Observable<Account[]> {
    const method: string = isActive ? 'myStrategies.getActiveAccounts' : 'myStrategies.getClosedAccounts';
    this.loaderService.showLoader();
    const options: StrategyAccontsOptions = new StrategyAccontsOptions();
    options.StrategyID = strategyID;

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${this.apiUrl}/${method}`, options).subscribe((response: any) => {
      const accounts: Account[] = [];

      response.Accounts.forEach((a: any) => {
        accounts.push(this.createInstanceService.createAccount(a));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.currentStrategyAccountsSubject.next(accounts);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.currentStrategyAccountsSubject.asObservable();
  }

  //
  // Методы работы с инвестициями
  //

  // // Получение инвестиции по ID
  // getAccount(id: number): Observable<Account> {
  //   this.loaderService.showLoader();
  //   return this.http.post(`${CONFIG.baseApiUrl}/accounts.get`, { AccountID: id }).pipe(map((response: any) => {
  //     this.loaderService.hideLoader();
  //     return this.createInstanceService.createAccount(response);
  //   }));
  // }

  // Получение списка активных инвестиций
  getActiveMyAccounts(args: { paginator: Paginator, orderBy?: string }): Observable<Account[]> {
    this.loaderService.showLoader();
    const options: AccountsSearchOptions = new AccountsSearchOptions();
    options.Filter = { SearchMode: 'MyActiveAccounts' };
    options.OrderBy = { Field: args.orderBy, Direction: 'Desc' };

    if (args.paginator) {
      options.Pagination = {
        CurrentPage: args.paginator.currentPage,
        PerPage: args.paginator.perPage
      };
    }

    this.http.post(`${this.apiUrl}/strategies.search`, options).subscribe((response: any) => {
      const accounts: Account[] = [];
      //console.log('response', response);
      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies
        .forEach((strategy: any) => {
          if (strategy.Account) {
            const createStrategy = this.createInstanceService.createStrategy(strategy);
            const createAccount = this.createInstanceService.createAccount(strategy.Account);

            createAccount.strategy = createStrategy;
            createAccount.offer = strategy.offer ? this.createInstanceService.createOffer(strategy.Offer) : null;

            accounts.push(createAccount);
          }
        });

      // response.Strategies.forEach((strategy: any) => {
      //   const options: any = strategy.Account;

      //   accounts.push(new Account(new Account({
      //     id: options.ID,
      //     strategy: this.createInstanceService.createStrategy(strategy),
      //     isSecurity: options.IsSecurity,
      //     type: options.Type,
      //     accountSpecAssetID: options.AccountSpecAssetID,
      //     asset: options.Asset || options.AssetName,
      //     tradingIntervalCurrentID: options.TradingIntervalCurrentID,
      //     dtCreated: options.DTCreated || options.DT,
      //     balance: options.Balance,
      //     equity: options.Equity,
      //     margin: options.Margin,
      //     marginLevel: options.MarginLevel,
      //     intervalPnL: options.IntervalPnL || options.ProfitCurrentIntervalGross || options.ProfitCurrentIntervalNet,
      //     status: options.Status,
      //     factor: options.Factor,
      //     offer: options.Offer ? new Offer(options.Offer) : null,
      //     dtMCReached: options.MCReached,
      //     protection: options.Protection,
      //     protectionEquity: options.ProtectionEquity,
      //     dtProtectionReached: options.ProtectionReached,
      //     target: options.Target,
      //     targetEquity: options.TargetEquity,
      //     dtTargetReached: options.TargetReached,
      //     dtClosed: options.DTClosed,
      //     bonus: options.Bonus,
      //     availableToWithDraw: options.AvailableToWithdraw,
      //     profitBase: options.ProfitBase,
      //     precision: options.Precision,
      //     positionsCount: options.PositionsCount,
      //     accountMinBalance: options.AccountMinBalance,
      //     leverageMax: options.LeverageMax,
      //     freeMargin: options.FreeMargin,
      //     MCLevel: options.MCLevel,
      //     state: options.State,
      //     isMyStrategy: strategy.IsMyStrategy,
      //     profitCurrentIntervalGross: options.ProfitCurrentIntervalGross,
      //     feeToPay: options.FeeToPay,
      //     totalCommissionTrader: options.TotalCommissionTrader,
      //     feePaid: options.FeePaid,
      //     isMyAccount: options.IsMyAccount,
      //     currentDate: options.CurrentDate
      //   })));
      // });

      if (args.paginator) {
        args.paginator.totalItems = response.Pagination.TotalRecords;
        args.paginator.totalPages = response.Pagination.TotalPages;
      }
      this.loaderService.hideLoader();
      this.activeMyAccountsSubject.next(accounts.filter((a: Account) => a.isActive()));
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.activeMyAccountsSubject.asObservable();
  }

  // Получение списка закрытых инвестиций
  getClosedMyAccounts(pagination?: Paginator): Observable<Account[]> {
    this.loaderService.showLoader();
    const options: AccountsSearchOptions = new AccountsSearchOptions();

    options.OrderBy = {
      Field: 'DTClosed',
      Direction: 'Desc'
    };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${this.apiUrl}/accounts.searchClosed`, options).subscribe((response: any) => {
      const accounts: Account[] = [];
      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies
        .forEach((strategy: any) => {
          if (strategy.Account) {
            const createStrategy = this.createInstanceService.createStrategy(strategy);
            const createAccount = this.createInstanceService.createAccount(strategy.Account);
            createAccount.strategy = createStrategy;
            accounts.push(createAccount);
          }
        });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.closedMyAccountsSubject.next(accounts);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.closedMyAccountsSubject.asObservable();
  }

  // Получение деталей инвестиции
  getAccountStatement(args: { accountId: number }): Observable<any> {
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/accounts.get`, { AccountID: args.accountId }).subscribe((response: any) => {
      if (response.Strategy) {
        response.Strategy.PublicOffer = {
          CommissionRate: response.Strategy.Commission,
          FeeRate: response.Strategy.Fee
        };
        this.currentAccountStatementSubject.next({
          strategy: this.createInstanceService.createStrategy(response.Strategy),
          account: this.createInstanceService.createAccount(response.Account)

        });
      } else {
        this.currentAccountStatementSubject.next({
          strategy: null,
          account: null
        });
      }

      this.loaderService.hideLoader();
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/investments']);
        this.notificationsService.open('notify.investment.access.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      } else {
        this.notificationsService.open('notify.loading.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      }
    });

    return this.currentAccountStatementSubject.asObservable();
  }

  // Инвестировать в стратегию по публичной оферте
  addAccountPublicOffer(id: number, data: object): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: id,
      OfferID: data['offerId'],
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${this.apiUrl}/accounts.add`, options).pipe(
      map((response: any) => {
        // this.getActiveMyStrategies().subscribe();
        this.walletService.updateWallet().subscribe();
        this.getStrategyByID({ strategyId: id });
        // this.updateRatingList();
        this.notificationsService.open('notify.investment.created');
      })
    );
  }

  // Инвестировать в стратегию по cкрытой ссылке
  addAccountPrivateOffer(link: string, data: object): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      Link: link,
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${this.apiUrl}/accounts.add`, options).pipe(
      map((response: any) => {
        // this.getActiveMyStrategies().subscribe();
        this.walletService.updateWallet().subscribe();
        this.getStrategyByLink({ link: link });
        // this.updateRatingList();
        this.notificationsService.open('notify.investment.created');
      })
    );
  }

  // Пополнить инвестицию
  fundAccount(accountID: number, amount: number, methodName: string, methodArgs: any) {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.fund`, { AccountID: accountID, Amount: amount }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandBalanceID, accountID), methodName, methodArgs, 'notify.investment.funded');
      })
    );
  }

  // Приостановить инвестицию
  pauseAccount(accountID: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.pause`, { AccountID: accountID }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.paused');
      })
    );
  }

  // Возобновить инвестицию
  resumeAccount(accountID: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.resume`, { AccountID: accountID }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.resumed');
      })
    );
  }

  // Изменить профиль инвестиции
  changeAccountProfile(accountID: number, valueObj: { [key: string]: number }, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();

    const requests: any[] = [];

    if (valueObj.target) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setTarget`, {
          AccountID: accountID,
          Target: valueObj['target']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.target.changed');
          })
        )
      );
    }

    if (valueObj.protection) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setProtection`, {
          AccountID: accountID,
          Protection: valueObj['protection']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.protection.changed');
          })
        )
      );
    }

    if (valueObj.factor) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setFactor`, {
          AccountID: accountID,
          Factor: valueObj['factor']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.factor.changed');
          })
        )
      );
    }

    if (!requests.length) {
      this.loaderService.hideLoader();
      return of(null);
    }

    return forkJoin(requests);
  }

  // Вывести средства из инвестиции
  withdrawFromAccount(accountId: number, amount: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.withdraw`, { AccountID: accountId, Amount: amount }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandBalanceID, accountId), methodName, methodArgs, 'notify.investment.withdrawn');
      })
    );
  }

  // Закрыть инвестицию
  closeAccount(accountID: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.close`, { AccountID: accountID }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.closed');
      })
    );
  }

  // Получение статуса команды и запрос обновленного списка дынных после завершения обработки изменений
  updateAccount(command: Command, methodName: string, methodArgs: any, notificationText: string): void {
    const interval = setInterval(() => {
      this.commandService.checkAccountCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this[methodName](methodArgs)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.notificationsService.open(notificationText);
              this.destroy$.next(true);
            });
          this.walletService.updateWallet()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.destroy$.next(true);
            });
        }
      });
    }, 1000);
  }

  // Получение списка сделок по инвестиции
  getAccountDeals(id: number, pagination?: Paginator): Observable<object> {
    this.loaderService.showLoader();
    const options: DealsSearchOptions = new DealsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${this.apiUrl}/deals.search`, options).pipe(map((response: any) => {
      const result: { deals: Deal[], totals: object } = {
        deals: [],
        totals: {
          yield: response.DealsTotal.Profit,
          totalProfit: response.DealsTotal.TotalProfit,
          swap: response.DealsTotal.Swap,
          commission: response.DealsTotal.Commission
        }
      };

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Deals.forEach((deal: any) => {
        result.deals.push(this.createInstanceService.createDeal(deal));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      return result;
    }));
  }

  // Получение списка позиций по инвестиции
  getAccountPositions(id: number, pagination?: Paginator): Observable<object> {
    this.loaderService.showLoader();
    const options: PositionsSearchOptions = new PositionsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${this.apiUrl}/positions.search`, options).pipe(map((response: any) => {
      const result: { positions: Position[], totals: object } = {
        positions: [],
        totals: {
          profit: response.PositionsTotal.Profit,
          totalProfit: response.PositionsTotal.TotalProfit,
          swap: response.PositionsTotal.Swap
        }
      };

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      if (response.Positions.length) {
        response.Positions.forEach((position: any) => {
          result.positions.push(this.createInstanceService.createPosition(position));
        });

        if (pagination) {
          pagination.totalItems = response.Pagination.TotalRecords;
          pagination.totalPages = response.Pagination.TotalPages;
        }
      }

      this.loaderService.hideLoader();
      return result;
    }));
  }

  //
  // Методы для работы с рейтингом
  //
  // getRating(args: { ratingType: 0 | 1 | 2, paginator?: Paginator, searchText?: string }): Observable<Strategy[]> {
  //   this.loaderService.showLoader();
  //   const options: RatingSearchOptions = new RatingSearchOptions();
  //   options.Filter = {
  //     RatingType: args.ratingType,
  //   };

  //   if (args.searchText) {
  //     options.Filter.StrategyName = args.searchText;
  //   }

  //   if (args.paginator) {
  //     options.Pagination = {
  //       CurrentPage: args.paginator.currentPage,
  //       PerPage: args.paginator.perPage
  //     };
  //   }

  //   this.http.post(`${this.apiUrl}/ratings.get`, options).subscribe((response: any) => {
  //     const strategies: Strategy[] = [];

  //     response.Strategies.forEach((s: any) => {
  //       if (s.Account) {
  //         s.Strategy.Account = s.Account;
  //       }
  //       s.Strategy.Chart = s.Chart;
  //       strategies.push(this.createInstanceService.createStrategy(s.Strategy));
  //     });

  //     if (args.paginator) {
  //       args.paginator.totalItems = response.Pagination.TotalRecords;
  //       args.paginator.totalPages = response.Pagination.TotalPages;
  //     }

  //     this.loaderService.hideLoader();
  //     this.ratingStrategiesSubject.next(strategies);
  //   }, (error: HttpErrorResponse) => {
  //     this.notificationsService.open('notify.loading.error', {
  //       type: 'error',
  //       autoClose: true,
  //       duration: 3000
  //     });
  //   });

  //   return this.ratingStrategiesSubject.asObservable();
  // }

  getRating(args: { ageMin?: number, dealsMin?: number, yieldMin?: number, searchMode?: string, field?: string, paginator?: Paginator, searchText?: string, direction?: string }): Observable<Strategy[]> {
    this.loaderService.showLoader();
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      SearchMode: args.searchMode,
      AgeMin: args.ageMin,
      YieldMin: args.yieldMin,
      DealsMin: args.dealsMin
    };

    if (args.searchText) {
      options.Filter.Name = args.searchText;
    }

    options.OrderBy = {
      Field: args.field,
      Direction: args.direction
    };

    if (args.paginator) {
      options.Pagination = {
        CurrentPage: args.paginator.currentPage,
        PerPage: args.paginator.perPage
      };
    }

    this.http.post(`${this.apiUrl}/strategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (args.paginator) {
        args.paginator.totalItems = response.Pagination.TotalRecords;
        args.paginator.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.ratingStrategiesSubject.next(strategies);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.ratingStrategiesSubject.asObservable();
  }

  getAccountSpecAsset(): void {
    this.http.get(`${this.apiUrl}/accounts.searchSpec`).subscribe((response: any) => {
      this.accountSpecAsset = this.createInstanceService.createAccountSpecAsset(response.AccountSpecAsset[0]);
    });
  }

  // getBrandRatings(linkOptions: string): Observable<Rating[]> {
  //   this.loaderService.showLoader();

  //   this.http.get(linkOptions).subscribe((result: any) => {
  //     const ratings: Rating[] = [];

  //     result.Ratings.forEach((rating: any) => {
  //       ratings.push(this.createInstanceService.createRating(rating));
  //     });

  //     this.loaderService.hideLoader();
  //     this.ratingsSubject.next(ratings);
  //   }, (error: HttpErrorResponse) => {
  //     this.notificationsService.open('notify.loading.error', {
  //       type: 'error',
  //       autoClose: true,
  //       duration: 3000
  //     });
  //   });

  //   return this.ratingsSubject.asObservable();
  // }

  getBrandRatings(): Observable<any[]> {
    const url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;
    const linkOptions: string = `${url}/options.json`;

    this.http.get(linkOptions).subscribe((result: any) => {
      const ratings: any[] = [];

      (result.Ratings || []).forEach((rating: any) => {
        ratings.push(rating);
      });
      this.ratingsSubject.next(ratings);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.ratingsSubject.asObservable();
  }

  getOptionsRatings(): Observable<any> {
    const url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;

    return this.http.get(`${url}/options.json`);
  }
}
