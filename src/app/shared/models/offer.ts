export class Offer {
  comission: number;
  fee: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
