import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { formatCurrency } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  locale: string;

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService
  ) {
    this.locale = this.translateService.currentLang;
  }

  transform(value: number): string {
    if (!value) {
      value = 0;
    }

    return formatCurrency(value, this.locale, '', '', '1.2-2');
  }
}
