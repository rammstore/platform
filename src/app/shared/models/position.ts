export class Position {
  id: number;               // ID позиции
  symbol: string;           // Название инструмента
  volume: number;           // Открытый объем
  price: number;            // Средняя цена открытия
  margin: number;           // Маржа под открытый объем
  swap: number;             // Накопленный своп
  profit: number;           // Прибыль/убыток без учета свопа
  totalProfit: number;      // Прибыль/убыток с учетом свопа
  profitCalcQuote: number;  // Котировка, по которой вычислялась прибыль
  precisionPrice: number;   // Количество знаков после запятой при выводе цены
  precisionVolume: number;  // Количество знаков после запятой при выводе объема
  type: string;             // Тип
  currentPrice: number;     // Текущая цена

  constructor(
    options: any
  ) {
    Object.assign(this, options);
    this.setType();
  }

  getAbsVolume(): number {
    return Math.abs(this.volume);
  }

  getType(): string {
    return this.type;
  }

  setType(): void {
    switch (true) {
      case (this.volume > 0):
        this.type = 'buy';
        break;
      case (this.volume < 0):
        this.type = 'sell';
        break;
      case (this.volume === 0):
      default:
        this.type = 'no data to display';
    }
  }
}
