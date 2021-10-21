import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, Account } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-investment',
  templateUrl: './mobile-data-view-investment.component.html',
  styleUrls: ['./mobile-data-view-investment.component.scss']
})
export class MobileDataViewInvestmentComponent {
  @Input() accounts: Account[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();
  @Input() key: string;

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
