import { User } from '../user/user';
import { Company } from '../user/company';
import { Wallet } from '../user/wallet';
import { Session } from '../user/session';

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
