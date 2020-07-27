export class Offer {
  commissionRate: number;
  feeRate: number;
  id: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  getComission(): string {
    return (this.commissionRate * 1000000) + ' USD / 1 mln';
  }
}
