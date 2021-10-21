export class TraderInfo {
    feePaid: number;          // Выплаченное вознаграждение
    feeToPay: number;         // Невыплаченное вознаграждение
    masterAccount: string;    // Логин внешнего счета
    commissionPaid: number;   // Выплаченная комиссия
    commissionToPay: number;  // Невыплаченная комиссия

    constructor(options: any) {
        this.feePaid = options.FeePaid;
        this.feeToPay = options.FeeToPay;
        this.masterAccount = options.MasterAccount;
        this.commissionPaid = options.CommissionPaid;
        this.commissionToPay = options.CommissionToPay;
      }
}