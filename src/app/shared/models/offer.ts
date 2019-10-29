export class Offer {
  commission: number;
  fee: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
