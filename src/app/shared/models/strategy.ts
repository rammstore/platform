import { Account } from './account';
import { Offer } from './offer';
import { PartnerInfo } from './partner-info';
import { TraderInfo } from './trader-info';

export class Strategy {
  id: number;             // ID стратегии
  name: string;           // Название стратегии
  dtCreated: Date;        // Дата создания стратегии
  dtClosed: Date;         // Дата закрытия стратегии
  dtStat: Date;           // Дата сбора статистики
  // partnerShare: number;   // Доля партнера
  status: number;         // Статус
  profit: number;         // Прибыль в % (Yield)
  accounts: number;  // Количество счетов
  symbols: string;        // Строка с перечислением самых используемых торговых инструментов (не более 3-х)
  account: Account;       // Инвестиция
  publicOffer: Offer;     // Публичный оффер
  linkOffer: Offer;       // Частный оффер
  isMyStrategy: boolean;  // Признак собственной стратегии
  ageByDays: number;      // Возраст в днях
  monthlyYield: number;   // Месячная прибыль в %
  equity: number;         // Инвестиции
  traderInfo: TraderInfo; // Выплаченное вознаграждение и невыплаченное вознаграждение
  partnerInfo: PartnerInfo; 
  commission: number;      // Комиссия за оборот
  chart: {Yield: number}[];
  masterAccount: string;
  link: string;
  youTubeVideoId: string;  // id видео из YouTube для формирования ссылки на видео 

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  isActive(): boolean {
    // @TODO: declare type or create enum for status possible values
    return this.status !== 4;
  }

  isPaused(): boolean {
    return this.status === 2;
  }

  getAgeWeeks(): number {
    const now: number = new Date().getTime();
    const created: number = new Date(this.dtStat).getTime();

    if (this.ageByDays === 0) {
      return 0;
    }

    if (this.ageByDays) {
      return Math.floor(this.ageByDays / 7);
    }

    return Math.floor((now - created) / (1000 * 3600 * 24 * 7));
  }

  getFeeRate(): number {
    if (this.linkOffer) {
      return this.linkOffer.feeRate;
    }

    if (this.publicOffer) {
      return this.publicOffer.feeRate;
    }

    if (this.account) {
      return this.account.offer.feeRate;
    }

    return 0;
  }

  getCommissionRate(): number {
    if (this.linkOffer) {
      return this.linkOffer.commissionRate;
    }
    
    if (this.publicOffer) {
      return this.publicOffer.commissionRate;
    }

    if (this.account) {
      return this.account.offer.commissionRate;
    }

    return 0;
  }

  isSecured(): boolean {
    return this.account.isSecurity;
  }

  isMy(): boolean {
    return this.isMyStrategy;
  }

  getColorClass(property: string): string {
    if (this[property] === 0 || !this[property]) {
      return '';
    }

    return this[property] > 0 ? 'positive' : 'negative';
  }

  getYouTubeLink(){
    const link: string = "https://www.youtube.com/watch?v=";

    return link + this.youTubeVideoId;
  }
}
