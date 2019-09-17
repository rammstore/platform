// import { Session } from './session';

export class User {
  firstName: string;
  lastName: string;
  login: string;
  language: string;
  pushToken: string;
  // session: Session;

  constructor(
    firstName: string,
    lastName: string,
    login: string,
    pushToken: string,
    language: string
    // session: Session
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.login = login;
    this.pushToken = pushToken;
    this.language = language || 'ru';
    // this.session = session;
  }
}
