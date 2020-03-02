import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account, Paginator } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-investment-closed',
  templateUrl: './mobile-data-view-investment-closed.component.html',
  styleUrls: ['./mobile-data-view-investment-closed.component.scss']
})
export class MobileDataViewInvestmentClosedComponent {
  @Input() accounts: Account[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
