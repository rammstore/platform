export interface EntityInterface {
  Filter?: any;
  OrderBy?: Order;
  Pagination?: any;
  Strategies?: any[];
  Wallets?: any[];
  Accounts?: any[];
  Account?: Account;
}

interface Order{
  Field: string;
  Direction: string;
}
