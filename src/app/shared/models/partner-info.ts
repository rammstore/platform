export class PartnerInfo{
    feePaid: number;          // Выплаченное вознаграждение
    feeToPay: number;         // Невыплаченное вознаграждение
    commissionPaid: number;   // Выплаченная комиссия
    commissionToPay: number;  // Невыплаченная комиссия

    constructor(options: any) {
        this.feePaid = options.FeePaid;
        this.feeToPay = options.FeeToPay;
        this.commissionPaid = options.CommissionPaid;
        this.commissionToPay = options.CommissionToPay;
      }
}