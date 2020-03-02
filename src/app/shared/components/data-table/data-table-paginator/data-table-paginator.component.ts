import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Paginator } from '@app/models';

@Component({
  selector: 'app-data-table-paginator',
  templateUrl: './data-table-paginator.component.html',
  styleUrls: ['./data-table-paginator.component.scss']
})
export class DataTablePaginatorComponent {
  @Input() paginator: Paginator;
  @ViewChild('perPageInput', {static: false}) perPageInput;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  getPages(): Array<string | number> {
    const pagesArray: number[] = Array(this.paginator.totalPages).fill('').map((x, i) => i + 1);

    if (pagesArray.length <= 5) {
      return pagesArray;
    }

    const result: any[] = [];

    if (!result.includes[pagesArray[0]]) {
      result.push(pagesArray[0]);
    }

    if (!result.includes(this.paginator.currentPage - 1) && (this.paginator.currentPage - 1) > 1) {
      result.push(this.paginator.currentPage - 1);
    }

    if (!result.includes(this.paginator.currentPage)) {
      result.push(this.paginator.currentPage);
    }

    if (!result.includes(this.paginator.currentPage + 1) && (this.paginator.currentPage + 1) < this.paginator.totalPages) {
      result.push(this.paginator.currentPage + 1);
    }

    if (!result.includes(this.paginator.totalPages)) {
      result.push(this.paginator.totalPages);
    }

    if (result[1] !== 2) {
      result.splice(1, 0, '...');
    }

    if (result[result.length - 2] !== this.paginator.totalPages - 1) {
      result.splice(result.length - 1, 0, '...');
    }

    return result;
  }

  selectPage(pageNumber: number) {
    this.paginator.currentPage = pageNumber;
    this.paginationChanged.emit();
  }

  changePerPage(perPage: number): void {
    if (perPage < 1) {
      perPage = 1;
    }
    if (perPage > 100) {
      perPage = 100;
    }


    this.paginator.currentPage = 1;
    this.paginator.perPage = perPage;
    this.perPageInput.nativeElement.value = perPage;
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
