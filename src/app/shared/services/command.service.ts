import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Command } from '@app/models/command';
import { interval, Observable } from 'rxjs/index';
import { CONFIG } from '../../../config';
import { map, takeUntil, takeWhile, timeInterval } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private http: HttpClient
  ) { }

  checkStrategyCommand(command: Command): Observable<number> {
    const options: object = {
      StrategyCommandID: command.id,
      StrategyID: command.dataID
    };

    return this.http.post(`${CONFIG.baseApiUrl}/strategyCommands.get`, options).pipe(
      map((response: any) => {
        return response.StrategyCommandStatus;
      })
    );
  }

  checkAccountCommand(command: Command): Observable<number> {
    const options: object = {
      AccountCommandID: command.id,
      AccountID: command.dataID,
      CommandBalanceID: command.id
    };

    return this.http.post(`${CONFIG.baseApiUrl}/accountCommands.get`, options).pipe(
      map((response: any) => {
        return response.AccountCommandStatus;
      })
    );
  }
}
