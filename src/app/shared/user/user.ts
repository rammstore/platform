export class User {
  firstName: string;
  lastName: string;
  login: string;
  language: string;
  pushToken: string;

  constructor(
    firstName?: string,
    lastName?: string,
    login?: string,
    pushToken?: string,
    language?: string
  ) {
    this.firstName = firstName || null;
    this.lastName = lastName || null;
    this.login = login || null;
    this.pushToken = pushToken || null;
    this.language = language || 'ru';
  }
}
