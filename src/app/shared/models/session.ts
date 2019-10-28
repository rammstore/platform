export class Session {
  dtLastActivity: Date;
  expirationMinutes: number;
  token: string;
  walletID: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
