export class TableColumn {
  label: string;
  property: string;
  rowspan: number = 1;
  colspan: number = 1;
  pipe: { pipe: any, args: any[] } = { pipe: null, args: [] };
  colored: boolean;
  fontSize: number = 14;

  constructor(options: any) {
    Object.assign(this, options);

    if (!this.pipe.args) {
      this.pipe.args = [];
    }
  }
}

