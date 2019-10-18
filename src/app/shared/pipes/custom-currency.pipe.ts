import { Pipe, PipeTransform } from '@angular/core';
import { CONFIG } from '../../../config';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    const integers: string = Math.floor(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, CONFIG.currencyFormat.groupSeparator);
    const decimals: string = ((Math.abs(value) - Math.floor(Math.abs(value))).toFixed(CONFIG.currencyFormat.fractionSize)).toString().split('.')[1];
    const asset: string = JSON.parse(window.sessionStorage.auth).wallets[0].asset;
    const minus: string = value < 0 ? '-' : '';
    return `${minus}${integers}${CONFIG.currencyFormat.fractionSeparator}${decimals} ${asset}`;
  }
}
