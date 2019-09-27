import { Component, Input, OnInit } from '@angular/core';
import { Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() tableHeader: TableHeaderRow[];

  constructor() { }

  ngOnInit() {
  }

  getItemLink(item: any): string {
    let link: string = '';

    switch (true) {
      case (item instanceof Strategy):
        link = 'strategies';
        break;
      default:
        link = '';
    }

    return `/${link}/${item.id}`;
  }
}
