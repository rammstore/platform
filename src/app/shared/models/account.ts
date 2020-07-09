import { Strategy } from '@app/models/strategy';

export class Account {
  id: number;                       // ID счета (инвестиции)
  strategy: Strategy;               // Стратегия
  isSecurity: boolean;              // Признак счета управляющего
  type: number;                     // Тип инвестиции
  accountSpecAssetID: number;       // Спецификация счета для заданного актива
  asset: string;                    // Название валюты счета
  tradingIntervalCurrentID: number; // ID текущего торгового интервала
  dtCreated: Date;                  // Дата создания
  balance: number;                  // Баланс счета
  equity: number;                   // Эквити (средства)
  margin: number;                   // Задействованная маржа
  marginLevel: number;              // Уровень маржи
  intervalPnL: number;              // Прибыль/убыток в текущем торговом интервале
  status: number;                   // Статус
  factor: number;                   // Повышающий/понижающий коэффициент копирования
  dtMCReached: Date;                // Дата/время срабатывания StopOut
  protection: number;               // Процент защиты счета
  protectionEquity: number;         // Значение эквити, при котором сработает защита счета
  dtProtectionReached: Date;        // Дата/время срабатывания защиты счета
  target: number;                   // Целевая доходность
  targetEquity: number;             // Целевая доходность в валюте счета
  dtTargetReached: number;          // Дата/время достижения целевой доходности
  dtClosed: Date;                   // Дата закрытия
  bonus: number;                    // Бонус
  availableToWithDraw: number;      // Доступно для снятия
  profitBase: number;               // База для подсчета вознаграждения
  precision: number;                // Точность округления, знаки после запятой
  positionsCount: number;           // Количество позиций
  accountMinBalance: number;        // Минимальный баланс инвестиции
  leverageMax: number;              // Плечо
  freeMargin: number;               // Свободная маржа
  MCLevel: number;                  // StopOut
  state: number;                    // Состояние
  isMyStrategy: boolean;            // Моя стратегия
  profitCurrentIntervalGross: number;
  feeToPay: number;                 // Невыплаченное вознаграждение
  totalCommissionTrader: number;
  feePaid: number;
  isMyAccount: boolean;
  currentDate: Date;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  isActive(): boolean {
    return this.status !== 6;
  }

  isPaused(): boolean {
    return this.status === 4;
  }

  isSecured(): boolean {
    return this.isSecurity;
  }

  isMy(): boolean {
    if (this.isMyAccount === false) {
      return false;
    }

    if (this.isMyAccount === true) {
      return true;
    }

    if (!this.strategy) {
      return this.isMyStrategy;
    }

    return this.strategy.isMyStrategy;
  }

  getStatus(): string {
    switch (this.status) {
      case 0:
        return 'New (without money)';
        break;
      case 1:
        return 'Active (trading)';
        break;
      case 2:
        return 'MC';
        break;
      case 3:
        return 'Protection target';
        break;
      case 4:
        return 'Pause';
        break;
      case 5:
        return 'Disabled (can\'t trade)';
        break;
      case 6:
        return 'Closed (can\'t activate)';
        break;
    }
  }

  getType(): string {
    switch (this.status) {
      case 0:
        return 'Real security';
        break;
      case 1:
        return 'Virtual master';
        break;
      case 2:
        return 'Real internal ramm account';
        break;
      case 3:
        return 'Real external account';
        break;
    }
  }

  getAgeWeeks(): number {
    const now: number = this.dtClosed ? new Date(this.dtClosed).getTime() : new Date().getTime();
    const created: number = new Date(this.dtCreated).getTime();
    return Math.floor((now - created) / (1000 * 3600 * 24 * 7));
  }

  getTargetAmount(): number {
    return this.targetEquity;
    // return (1 + this.target) * this.equity;
  }

  getProtectionAmount(): number {
    return this.protectionEquity;
    // return this.protection * this.equity;
  }

  getState(): string {
    switch (this.state) {
      case 0:
        return 'New';
        break;
      case 1:
        return '(not used)';
        break;
      case 2:
        return 'Active, no positions';
        break;
      case 3:
        return 'Active, with positions';
        break;
      case 4:
        return 'Margin call, with positions';
        break;
      case 5:
        return 'Margin call, no positions';
        break;
      case 6:
        return 'Protection, with positions';
        break;
      case 7:
        return 'Protection, no positions';
        break;
      case 8:
        return 'Target, with positions';
        break;
      case 9:
        return 'Target, no positions';
        break;
      case 10:
        return 'Pause, with positions';
        break;
      case 11:
        return 'Pause, no positions';
        break;
      case 12:
        return 'Disabled, with positions';
        break;
      case 13:
        return 'Disabled, no positions';
        break;
      case 14:
        return 'Closed, with positions';
        break;
      case 15:
        return 'Closed, no positions';
        break;
    }
  }

  getColorClass(property: string): string {
    switch (true) {
      case this[property] > 0:
        return 'positive';
      case this[property] < 0:
        return 'negative';
      default:
        return '';
    }
  }
}
