import {Paginator} from "@app/models/paginator";

// tslint:disable-next-line:class-name
export interface iStrategiesSearchOptions {
  Filter?: {
    SearchMode?: string,
    Name?: string,
    MyActiveAccounts?: boolean,
    MyStrategies?: number,
    ActiveStrategies?: number,
    IsActive?: boolean,
    AgeMin?: number,
    YieldMin?: number,
    DealsMin?: number,
  };
  Pagination?: {
    CurrentPage?: number,
    PerPage?: number
  };
  OrderBy?: {
    Field?: string,
    Direction?: string
  };
}
