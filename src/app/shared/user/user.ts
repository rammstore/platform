export class User {
  firstName: string;
  lastName: string;
  login: string;
  language: string;
  pushToken: string;

  constructor(
    firstName: string,
    lastName: string,
    login: string,
    pushToken: string,
    language: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.login = login;
    this.pushToken = pushToken;
    this.language = language || 'ru';
  }
}
