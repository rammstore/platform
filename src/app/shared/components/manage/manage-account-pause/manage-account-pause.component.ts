import { Component, Input, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Account } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-manage-account-pause',
  templateUrl: './manage-account-pause.component.html',
  styleUrls: ['./manage-account-pause.component.scss']
})
export class ManageAccountPauseComponent implements OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  successful$ = new Subject();

  // component data
  account: Account;
  @Input() methodName: string;
  @Input() methodArgs: any;

  constructor(
    private dataService: DataService,
    public modalRef: BsModalRef
  ) { }

  pause(): void {
    this.dataService.pauseAccount(this.account.id, this.methodName, this.methodArgs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.successful$.next(true);
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
