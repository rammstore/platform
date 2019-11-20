import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { DynamicPipe } from '@app/pipes/dynamic.pipe';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';



@NgModule({
  declarations: [
    DynamicPipe,
    CustomCurrencyPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DynamicPipe,
    PercentPipe,
    DatePipe,
    CustomCurrencyPipe
  ],
  providers: [
    DynamicPipe,
    PercentPipe,
    DatePipe,
    CustomCurrencyPipe,
    CurrencyPipe
  ]
})
export class PipesModule { }
