export class StrategiesSearchOptions {
  Filter: {
    SearchMode?: string,
    Name?: string,
    MyActiveAccounts?: boolean,
    MyStrategies?: number,
    ActiveStrategies?: number,
    IsActive?: boolean,
    AgeMin?: number,
    Yield?: number,
    DealsMin?: number,
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
    SearchMode?: string,
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

export class RatingSearchOptions {
  Filter: {
    RatingType: number,
    StrategyName?: string
  };

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };
}

export class StrategyAccontsOptions {
  StrategyID: number;

  Pagination: {
    CurrentPage?: number,
    PerPage?: number
  };
}
