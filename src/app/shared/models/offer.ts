export class Offer {
  id: number;
  dTCreated: string;
  isPublic: boolean;
  link: string;
  partnerShareRate: number;
  status: number;
  activeAccounts: boolean;
  totalAccounts: number;

  commissionPaid: number;
  commissionRate: number;
  commissionToPay: number;
  feePaid: number;
  feeRate: number;
  feeToPay: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);

    this.commissionRate = options.CommissionRate || 0;
    this.link = options.Link;
    this.feeRate = options.FeeRate;
    this.id = options.ID;
    this.isPublic = options.IsPublic;
    this.dTCreated = options.DTCreated;
    this.partnerShareRate = options.PartnerShareRate;
    this.status = options.Status;
    this.activeAccounts = options.ActiveAccounts;
    this.totalAccounts = options.TotalAccounts;

    this.commissionPaid = options.CommissionPaid;
    this.commissionRate = options.CommissionRate;
    this.commissionToPay = options.CommissionToPay;

    this.feePaid = options.FeePaid;
    this.feeRate = options.FeeRate;
    this.feeToPay = options.FeeToPay;
  }

  getComission(): string {
    return (this.commissionRate * 1000000) + ' USD / 1 mln';
  }

  getStatus() {
    let value = '';

    switch (this.status) {
      case 0: {
        value = 'enum.status.enabled';
        break;
      }
      case 1: {
        value = 'enum.status.disabled';
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
