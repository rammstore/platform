export interface EntityInterface {
  Filter?: any;
  OrderBy?: Order;
  Pagination?: any;
  Strategies?: any[];
  Wallets?: any[];
}

interface Order{
  Field: string;
  Direction: string;
}
