import { Component, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Account } from '@app/models';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-manage-account-pause',
  templateUrl: './manage-account-pause.component.html',
  styleUrls: ['./manage-account-pause.component.scss']
})
export class ManageAccountPauseComponent implements OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account: Account;

  constructor(
    private accountService: AccountService,
    public modalRef: BsModalRef,
  ) { }

  pause(): void {
    this.accountService.pause(this.account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.account.pause();
        this.modalRef.hide();
      });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
