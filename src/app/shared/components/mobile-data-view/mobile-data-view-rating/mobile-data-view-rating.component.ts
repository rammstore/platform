import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, Strategy } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-rating',
  templateUrl: './mobile-data-view-rating.component.html',
  styleUrls: ['./mobile-data-view-rating.component.scss']
})
export class MobileDataViewRatingComponent {
  @Input() strategies: Strategy[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();
  @Input() methodName: string;
  @Input() methodArgs: any;

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
