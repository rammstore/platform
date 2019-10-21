import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { AuthData, Paginator, Wallet, WalletTransfer } from '@app/models';
import { LoaderService } from '@app/services/loader.service';
import { StorageService } from '@app/services/storage.service';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { map } from 'rxjs/operators';

class DealsSearchOptions {
  OrderBy: { Field?: string, Direction?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  walletSubject: BehaviorSubject<Wallet> = new BehaviorSubject<Wallet>(null);
  dealsSubject: BehaviorSubject<WalletTransfer[]> = new BehaviorSubject<WalletTransfer[]>([]);

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private createInstanceService: CreateInstanceService,
    private storageService: StorageService
  ) { }

  getWallet(): Observable<Wallet> {
    if (!this.walletSubject.value) {
      this.updateWallet().subscribe();
    }

    return this.walletSubject.asObservable();
  }

  updateWallet(): Observable<Wallet> {
    this.loaderService.showLoader();
    console.log(this.storageService.getSession());
    const walletID: number = this.storageService.getSession().walletID;

    return this.http.post(`${CONFIG.baseApiUrl}/wallets.get`, { ID: walletID }).pipe(
      map((response: any) => {
        const wallet: Wallet = this.createInstanceService.createWallet(response);
        this.walletSubject.next(wallet);
        this.loaderService.hideLoader();
        return wallet;
      })
    );
  }

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
