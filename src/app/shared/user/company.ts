export class Company {
  name: string;
  isDemo: boolean;
  contacts: any;

  constructor(
    name: string,
    isDemo: boolean,
    contacts: any
  ) {
    this.name = name;
    this.isDemo = isDemo;
    this.contacts = contacts;
  }
}
