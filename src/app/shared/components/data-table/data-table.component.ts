import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Deal, Strategy, WalletTransfer } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Paginator } from '@app/models/paginator';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() tableHeader: TableHeaderRow[];
  @Input() data: Array<Strategy | Account | Deal | WalletTransfer>;
  @Input() totalFields: Array<string> = null;
  coloredFields: string[] = ['yield', 'profit', 'totalProfit', 'intervalPnL', 'account.intervalPnL', 'amount', 'strategy.profit'];
  @Input() paginator: Paginator;
  @Input() shouldHighlightMyStrategies: boolean = false;
  @Output() paginationChanged: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  getItemLink(item: any): string {
    let link: string = '';

    switch (true) {
      case (item instanceof Strategy):
        link = 'strategies/details';
        break;
      default:
        link = '';
    }

    return `/${link}/${item.id}`;
  }

  /**
   * Метод для отображения вложенных свойств объекта.
   * Например, если нужно отобразить вознаграждение для стратегии (strategy.offer.fee).
   * Тогда item - это стратегия, property - путь по вложенности до нужного свойства ('offer.fee')
   * @param item
   * @param {string} property
   * @returns {any}
   */
  getPropertyValue(item: any, property: string): any {
    const splittedPropertyName: string[] = property.split('.');

    let res = {};
    Object.assign(res, item);

    splittedPropertyName.forEach((key: string) => {
      if (typeof res[key] === 'object') {
        Object.assign(res, res[key]);
      } else {
        res = res[key];
      }
    });

    return res;
  }

  isTotal(field: string): boolean {
    return this.totalFields.includes(field);
  }

  getTotal(property: string): number {
    const splittedPropertyName: string[] = property.split('.');
    let sum: number = 0;

    this.data.forEach((data: Strategy | Account) => {
      let nestedObj = {};
      Object.assign(nestedObj, data);

      splittedPropertyName.forEach((key: string) => {
        if (typeof nestedObj[key] === 'object') {
          Object.assign(nestedObj, nestedObj[key]);
        } else {
          sum = sum + nestedObj[key];
        }
      });
    });

    return sum;
  }

  isColored(field: string): boolean {
    return this.coloredFields.includes(field);
  }

  paginatorChanged(): void {
    this.paginationChanged.emit();
  }
}
