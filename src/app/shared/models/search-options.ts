export class StrategiesSearchOptions {
  Filter: {
    Name?: string,
    MyActiveAccounts?: boolean,
    MyStrategies?: boolean,
    ActiveStrategies?: boolean
  };

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };

  OrderBy: {
    Field?: string,
    Direction?: string
  };
}

export class AccountsSearchOptions {
  Filter: {
    MyActiveAccounts?: boolean,
    Value?: string
  };

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };

  OrderBy: {
    Field?: string,
    Direction?: string
  };
}

export class DealsSearchOptions {
  Filter: {
    AccountID: number
  };

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };

  OrderBy: {
    Field?: string,
    Direction?: string
  };
}

export class PositionsSearchOptions {
  Filter: {
    AccountID: number
  };

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };

  OrderBy: {
    Field?: string,
    Direction?: string
  };
}
