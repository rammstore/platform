import { NgModule } from '@angular/core';
import { MobileDataViewInvestmentComponent } from './mobile-data-view-investment/mobile-data-view-investment.component';
import { MobileDataViewStrategyComponent } from './mobile-data-view-strategy/mobile-data-view-strategy.component';
import { MobileDataViewRatingComponent } from './mobile-data-view-rating/mobile-data-view-rating.component';
import { SharedModule } from '@app/shared.module';
import { DataTableModule } from '@app/components/data-table/data-table.module';

@NgModule({
  declarations: [
    MobileDataViewInvestmentComponent,
    MobileDataViewStrategyComponent,
    MobileDataViewRatingComponent
  ],
  imports: [
    SharedModule,
    DataTableModule
  ],
  exports: [
    MobileDataViewInvestmentComponent,
    MobileDataViewStrategyComponent,
    MobileDataViewRatingComponent
  ]
})
export class MobileDataViewModule { }
