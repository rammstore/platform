import {Strategy, Account} from '@app/models';

export interface StatementInterface {
  account: Account;
  strategy: Strategy;
}
