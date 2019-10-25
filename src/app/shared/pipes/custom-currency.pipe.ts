import { Pipe, PipeTransform } from '@angular/core';
import { CONFIG } from '../../../config';
import { StorageService } from '@app/services/storage.service';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(
    private storageService: StorageService
  ) {}

  transform(value: number): string {
    const asset: string = this.storageService.getWallet().asset;

    if (!value) {
      return `0${CONFIG.currencyFormat.fractionSeparator}00 ${asset}`;
    }

    // отсекаем лишние числа после запятой
    value = Math.floor(value * 100) / 100;

    const integers: string = Math.floor(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, CONFIG.currencyFormat.groupSeparator);
    const decimals: string = ((Math.abs(value) - Math.floor(Math.abs(value))).toFixed(CONFIG.currencyFormat.fractionSize)).toString().split('.')[1];

    const minus: string = value < 0 ? '-' : '';
    return `${minus}${integers}${CONFIG.currencyFormat.fractionSeparator}${decimals} ${asset}`;
  }
}
