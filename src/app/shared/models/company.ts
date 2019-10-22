export class Company {
  name: string;
  isDemo: boolean;
  contacts: any;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }
}
