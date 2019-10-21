import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs/index';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { AuthData } from '@app/models';
import { StorageService } from '@app/services/storage.service';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  links: ContentTabLink[] = [
    new ContentTabLink('Результаты', '/bill'),
    new ContentTabLink('Пополнить', '/bill/fund'),
    new ContentTabLink('Вывести', '/bill/withdraw'),
    new ContentTabLink('История переводов', '/bill/last-transfers')
  ];
  authData: AuthData;

  constructor(
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.storageService.getAuthData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authData: AuthData) => {
        this.authData = authData;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
