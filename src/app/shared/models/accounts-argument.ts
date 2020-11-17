import { Paginator } from './paginator';

export class AccountsArgument {
    searchMode: string;
    field: string;
    direction: string;
    paginator: Paginator;

    constructor(
        options: any
      ) {
        Object.assign(this, options);
      }
}