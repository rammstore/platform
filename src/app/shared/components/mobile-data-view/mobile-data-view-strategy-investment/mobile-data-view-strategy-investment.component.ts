import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, Account } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-strategy-investment',
  templateUrl: './mobile-data-view-strategy-investment.component.html',
  styleUrls: ['./mobile-data-view-strategy-investment.component.scss']
})
export class MobileDataViewStrategyInvestmentComponent {
  @Input() accounts: Account[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
