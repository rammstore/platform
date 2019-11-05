import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator, WalletTransfer } from '@app/models';

@Component({
  selector: 'app-mobile-data-view-last-transfers',
  templateUrl: './mobile-data-view-last-transfers.component.html',
  styleUrls: ['./mobile-data-view-last-transfers.component.scss']
})
export class MobileDataViewLastTransfersComponent {
  @Input() transfers: WalletTransfer[];
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
