export class Session {
  dtLastActivity: Date;
  expirationMinutes: number;
  token: string;
  walletID: number;

  constructor(
    token: string,
    walletID: number,
    dtLastActivity: Date,
    expirationMinutes: number
  ) {
    this.token = token;
    this.walletID = walletID;
    this.dtLastActivity = dtLastActivity;
    this.expirationMinutes = expirationMinutes;
  }
}
