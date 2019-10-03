import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/index';
import { Strategy } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import { BsModalRef } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-strategy-manage-close',
  templateUrl: './strategy-manage-close.component.html',
  styleUrls: ['./strategy-manage-close.component.scss']
})
export class StrategyManageCloseComponent implements OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;

  constructor(
    private strategyService: StrategyService,
    public modalRef: BsModalRef,
  ) { }

  close(): void {
    this.strategyService.close(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.strategy.status = 4;
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
