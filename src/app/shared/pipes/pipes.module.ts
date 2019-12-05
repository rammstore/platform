import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { DynamicPipe } from '@app/pipes/dynamic.pipe';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from './custom-date.pipe';



@NgModule({
  declarations: [
    DynamicPipe,
    CustomCurrencyPipe,
    CustomDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DynamicPipe,
    PercentPipe,
    DatePipe,
    CustomCurrencyPipe,
    CustomDatePipe
  ],
  providers: [
    DynamicPipe,
    PercentPipe,
    DatePipe,
    CustomCurrencyPipe,
    CurrencyPipe,
    CustomDatePipe
  ]
})
export class PipesModule { }
