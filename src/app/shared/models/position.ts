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

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  getAbsVolume(): number {
    return Math.abs(this.volume);
  }

  getType(): string {
    return '';
  }
}
