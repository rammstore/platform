import {Paginator} from "@app/models";

export interface Arguments {
  ageMin?: number;
  dealsMin?: number;
  yieldMin?: number;
  searchMode?: string;
  field?: string;
  paginator?: Paginator;
  searchText?: string;
  direction?: string;
}
