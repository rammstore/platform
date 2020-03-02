export class User {
  firstName: string;
  lastName: string;
  login: string;
  language: string;
  pushToken: string;
  id: number;
  idCompany: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
