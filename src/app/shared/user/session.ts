export class Session {
  dtLastActivity: Date;
  expirationMinutes: number;
  token: string;
  walletID: number;

  constructor(
    token?: string,
    walletID?: number,
    dtLastActivity?: Date,
    expirationMinutes?: number
  ) {
    this.token = token || null;
    this.walletID = walletID || null;
    this.dtLastActivity = dtLastActivity || null;
    this.expirationMinutes = expirationMinutes || null;
  }
}
