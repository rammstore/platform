import { Account } from './account';
import { Offer } from './offer';

export class Strategy {
  id: number;             // ID стратегии
  name: string;           // Название стратегии
  dtCreated: Date;        // Дата создания стратегии
  dtClosed: Date;         // Дата закрытия стратегии
  dtStat: Date;           // Дата сбора статистики
  partnerShare: number;   // Доля партнера
  status: number;         // Статус
  profit: number;         // Прибыль в % (Yield)
  accountsCount: number;  // Количество счетов
  symbols: string;        // Строка с перечислением самых используемых торговых инструментов (не более 3-х)
  account: Account;       // Инвестиция
  offer: Offer;           // Оффер

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
    const created: number = new Date(this.dtCreated).getTime();
    return Math.round((now - created) / (1000 * 3600 * 24 * 7));
  }

  pause(): void {
    this.status = 2;
  }

  resume(): void {
    this.status = 1;
  }

  close(): void {
    this.status = 4;
  }
}
