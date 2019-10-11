import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paginator } from '@app/models';

@Component({
  selector: 'app-data-table-paginator',
  templateUrl: './data-table-paginator.component.html',
  styleUrls: ['./data-table-paginator.component.scss']
})
export class DataTablePaginatorComponent {
  @Input() paginator: Paginator;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  getPages(): number[] {
    return Array(this.paginator.totalPages).fill('').map((x, i) => i + 1);
  }

  selectPage(pageNumber: number) {
    this.paginator.currentPage = pageNumber;
    this.paginationChanged.emit();
  }

  changePerPage(perPage: number): void {
    if (perPage < 1) {
      perPage = 1;
    }

    this.paginator.currentPage = 1;
    this.paginator.perPage = perPage;
    this.paginationChanged.emit();
  }

  shouldDisplayLink(index: number): boolean {
    if (this.paginator.totalPages <= 5) {
      return true;
    }

    if (index === this.paginator.currentPage) {
      return true;
    }

    if (index === this.paginator.currentPage + 1 || index === this.paginator.currentPage - 1) {
      return true;
    }

    if (index === 1 || index === this.paginator.totalPages) {
      return true;
    }

    return false;
  }
}
