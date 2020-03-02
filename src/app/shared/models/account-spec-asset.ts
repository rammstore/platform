export class AccountSpecAsset {
  idAccountSpecAsset: number;
  idSpec: number;
  idAsset: number;
  idStreamDefault: number;
  idStreamDefaultSecurity: number;
  accountMinBalance: number;
  securityMinBalance: number;
  precision: number;
  aBook: number;

  constructor (
    options: any
  ) {
    Object.assign(this, options);
  }
}
