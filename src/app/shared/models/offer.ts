import {MakePropertyLowercase} from '@app/handlers/make-property-lowercase' ;

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
    options = MakePropertyLowercase(options);

    Object.assign(this, options);

    this.commissionRate = options.commissionRate || 0;
    this.link = options.link;
    this.feeRate = options.feeRate;
    this.id = options.iD;
  }

  getComission(): string {
    return (this.commissionRate * 1000000) + ' USD / 1 mln';
  }

  getFeeRate(): string {
    return  `${(this.feeRate || 0) * 100}%`;
  }

  get FeePaid() {
    return this.feePaid || '';
  }

  get FeeToPay() {
    return this.feeToPay || '';
  }

  get CommissionToPay() {
    return this.commissionToPay || '';
  }

  get CommissionPaid() {
    return this.commissionPaid || '';
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
