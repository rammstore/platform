import {Paginator} from "@app/models";
import {Pagination} from "@app/interfaces/pagination.interface";

export interface Arguments {
  ageMin?: number;
  dealsMin?: number;
  yieldMin?: number;
  searchMode?: string;
  field?: string;
  paginator?: Paginator | Pagination;
  searchText?: string;
  direction?: string;
}
