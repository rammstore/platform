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
}
