import { Component, Input, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-manage-strategy-pause',
  templateUrl: './manage-strategy-pause.component.html',
  styleUrls: ['./manage-strategy-pause.component.scss']
})
export class ManageStrategyPauseComponent implements OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;

  updateStatus: string;

  constructor(
    private dataService: DataService,
    public modalRef: BsModalRef,
  ) { }

  pause(): void {
    this.updateStatus = "update";

    this.dataService.pauseStrategy(this.strategy.id, this.updateStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
