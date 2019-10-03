export class Paginator {
  perPage: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;

  constructor(
    options: any
  ) {
    this.perPage = options.perPage || 100;
    this.currentPage = options.currentPage || 1;
  }
}
