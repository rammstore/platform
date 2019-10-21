import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { Paginator, WalletTransfer } from '@app/models';
import { LoaderService } from '@app/services/loader.service';

class DealsSearchOptions {
  OrderBy: { Field?: string, Direction?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  dealsSubject: BehaviorSubject<WalletTransfer[]> = new BehaviorSubject<WalletTransfer[]>([]);

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) { }

  getDeals(accountID: number, pagination?: Paginator): Observable<WalletTransfer[]> {
    this.loaderService.showLoader();
    const options: DealsSearchOptions = new DealsSearchOptions();
    options.OrderBy = {
      Field: 'ID',
      Direction: 'Desc'
    };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/walletTransfers.search`, options).subscribe((response: any) => {
      const transfers: WalletTransfer[] = [];

      response.WalletTransfers.forEach((transfer: any) => {
        transfers.push(new WalletTransfer(
          transfer.ID,
          transfer.StrategyID,
          transfer.AccountID,
          transfer.DealID,
          transfer.DT,
          transfer.AccrualDate,
          transfer.Amount,
          transfer.Type,
          transfer.Comment
        ));
      });

      pagination.totalItems = response.Pagination.TotalRecords;
      pagination.totalPages = response.Pagination.TotalPages;
      this.loaderService.hideLoader();
      this.dealsSubject.next(transfers);
    });

    return this.dealsSubject.asObservable();
  }
}
