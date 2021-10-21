import {MakePropertyLowercase} from '@app/handlers/make-property-lowercase' ;

export class Offer {
  id: number;                 // ID оферты
  dTCreated: string;          // Дата создания стратегии
  feeRate: number;            // Вознаграждение с прибыли
  commissionRate: number;     // Размер комиссии
  partnerID: number;          // ID партнера
  partnerShareRate: number;   // Доля вознаграждения партнера
  link: string;               // Cсылка на оферту. Отображается партнеру и владельцу стратегии.
  type: number;               // 0-оферта трейдера, 1-непубличная, 2-публичная
  status: number;             // 0-active, 1-disabled (new investments prohibited), 2-closed (all active investments will closed)
  description: string;        // Описание, заданное при создании оферты. Отображается только владельцу стратегии.
  activeAccounts: number;     // Количество активных счетов
  totalAccounts: number;      // Количество счетов всего
  feePaid: number;            // Выплаченное вознаграждение
  feeToPay: number;           // Невыплаченное вознаграждение
  commissionPaid: number;     // Выплаченная комиссия
  commissionToPay: number;    // Невыплаченная комиссия

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

  get CommissionRate(): number {
    return this.commissionRate * 1000000;
  }

  getFeeRate(): string {
    return  `${(this.feeRate || 0) * 100}`;
  }

  get FeePaid() {
    return this.feePaid || '';
  }

  get FeeRate() {
    return (this.feeRate || 0) * 100;
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
