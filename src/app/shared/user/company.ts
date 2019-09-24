export class Company {
  name: string;
  isDemo: boolean;
  contacts: any;

  constructor(
    name?: string,
    isDemo?: boolean,
    contacts?: any
  ) {
    this.name = name || null;
    this.isDemo = isDemo || null;
    this.contacts = contacts || null;
  }
}
