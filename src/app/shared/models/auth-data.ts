import { User } from './user';
import { Company } from './company';
import { Wallet } from './wallet';
import { Session } from './session';

export class AuthData {
  client: User;
  company: Company;
  session: Session;
  wallets: Wallet[];

  constructor(
    options?: object
  ) {
    Object.assign(this, options);
  }

  getWallets(): Wallet[] {
    return this.wallets;
  }

  getAvailableMoney(): number {
    return Math.floor((this.getWallets()[0].balance - this.getWallets()[0].invested) * 100) / 100;
  }
}
