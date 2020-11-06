import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionEnum } from '@app/enum/section.enum';
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
  @Input() section: SectionEnum = SectionEnum.default;
  @Input() key: string;

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
