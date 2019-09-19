// import { User, Wallet, Company, Session } from '@app/user';

import { User } from '@app/user/user';
import { Company } from '@app/user/company';
import { Wallet } from '@app/user/wallet';
import { Session } from '@app/user/session';

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
