import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, Strategy } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-strategy',
  templateUrl: './mobile-data-view-strategy.component.html',
  styleUrls: ['./mobile-data-view-strategy.component.scss']
})
export class MobileDataViewStrategyComponent {
  @Input() strategies: Strategy[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
