import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { formatCurrency } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) {}

  transform(value: number): string {
    if (!value) {
      value = 0;
    }

    // console.log(formatCurrency(value, this.translateService.currentLang, '', 'USD', '1.2-2'));

    // return value;

    return formatCurrency(value, this.translateService.currentLang, '', 'USD', '1.2-2');
  }
}
