import { TableColumn } from '@app/models/table-column';

export class TableHeaderRow {
  columns: TableColumn[];

  constructor(
    columns: TableColumn[]
  ) {
    this.columns = columns;
  }
}
