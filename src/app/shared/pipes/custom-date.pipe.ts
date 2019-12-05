import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { CONFIG } from '@assets/config';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  format: string = CONFIG.dateFormat || 'yyyy-MM-dd HH:mm:ss';

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '';
    }

    return formatDate(value, this.format, 'en-US');
  }

}
