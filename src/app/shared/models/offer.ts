export class Offer {
  commissionRate: number;
  feeRate: number;
  id: number;
  dTCreated: string;
  isPublic: boolean;
  link: string;
  partnerShareRate: number;
  status: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
    this.commissionRate = options.CommissionRate;
    this.commissionRate = this.commissionRate || 0;
    this.link = options.Link;
    this.isPublic = options.IsPublic;
    this.dTCreated = options.DTCreated;
    this.partnerShareRate = options.PartnerShareRate;
    this.status = options.Status;
  }

  getComission(): string {
    return (this.commissionRate * 1000000) + ' USD / 1 mln';
  }

  getStatus() {
    let value = '';

    switch (this.status) {
      case 0: {
        value = 'enum.status.enable';
        break;
      }
      case 1: {
        value = 'enum.status.disable';
        break;
      }
      case 2: {
        value = 'enum.status.closed';
        break;
      }
    }

    return value;
  }
}
