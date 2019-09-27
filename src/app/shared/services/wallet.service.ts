import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { WalletTransfer } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  dealsSubject: BehaviorSubject<WalletTransfer[]> = new BehaviorSubject<WalletTransfer[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  getDeals(accountID: number, page: number = 1): Observable<WalletTransfer[]> {
    const options: object = {
      // Filter: {
      //   AccountID: 156
      // },
      Pagination: {
        CurrentPage: page,
        PerPage: 100
      },
      OrderBy: {
        Field: 'ID',
        Direction: 'Desc'
      }
    };

    this.http.post(`${CONFIG.baseApiUrl}/walletTransfers.search`, options).subscribe((response: any) => {
      console.log(response);
      const transfers: WalletTransfer[] = [];

      response.WalletTransfers.forEach((transfer: any) => {
        transfers.push(new WalletTransfer(
          transfer.ID,
          transfer.StrategyID,
          transfer.AccountID,
          transfer.DealID,
          new Date(transfer.DT),
          new Date(transfer.AccrualDate),
          transfer.Amount,
          transfer.Type,
          transfer.Comment
        ));
      });

      this.dealsSubject.next(transfers);
    });

    return this.dealsSubject.asObservable();
  }
}
