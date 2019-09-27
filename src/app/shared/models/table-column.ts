export class TableColumn {
  label: string;
  property: string;
  rowspan: number = 1;
  colspan: number = 1;

  constructor(options: any) {
    Object.assign(this, options);
  }
}

