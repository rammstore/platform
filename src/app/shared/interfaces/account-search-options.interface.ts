export interface iAccountsSearchOptions {
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