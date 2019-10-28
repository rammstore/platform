export class User {
  firstName: string;
  lastName: string;
  login: string;
  language: string;
  pushToken: string;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
