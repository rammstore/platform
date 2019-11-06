export class Offer {
  commission: number;
  fee: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  getComission(): string {
    return (this.commission * 1000000) + ' USD / 1 mln.';
  }
}
