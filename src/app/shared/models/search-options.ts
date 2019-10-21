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
}
