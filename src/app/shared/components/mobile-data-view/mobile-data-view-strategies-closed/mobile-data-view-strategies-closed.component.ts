import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Paginator, Strategy } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-strategies-closed',
  templateUrl: './mobile-data-view-strategies-closed.component.html',
  styleUrls: ['./mobile-data-view-strategies-closed.component.scss']
})
export class MobileDataViewStrategiesClosedComponent{
  @Input() strategies: Strategy[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
