import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Strategy } from '@app/models';
import { BsModalRef } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-manage-strategy-close',
  templateUrl: './manage-strategy-close.component.html',
  styleUrls: ['./manage-strategy-close.component.scss']
})
export class ManageStrategyCloseComponent implements OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;

  constructor(
    private dataService: DataService,
    public modalRef: BsModalRef,
  ) { }

  close(): void {
    this.dataService.closeStrategy(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
