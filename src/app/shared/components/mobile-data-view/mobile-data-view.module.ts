import { NgModule } from '@angular/core';
import { MobileDataViewInvestmentComponent } from './mobile-data-view-investment/mobile-data-view-investment.component';
import { MobileDataViewInvestmentClosedComponent } from './mobile-data-view-investment-closed/mobile-data-view-investment-closed.component';
import { MobileDataViewStrategyComponent } from './mobile-data-view-strategy/mobile-data-view-strategy.component';
import { MobileDataViewRatingComponent } from './mobile-data-view-rating/mobile-data-view-rating.component';
import { MobileDataViewLastTransfersComponent } from './mobile-data-view-last-transfers/mobile-data-view-last-transfers.component';
import { SharedModule } from '@app/shared.module';
import { DataTableModule } from '@app/components/data-table/data-table.module';

@NgModule({
  declarations: [
    MobileDataViewInvestmentComponent,
    MobileDataViewInvestmentClosedComponent,
    MobileDataViewStrategyComponent,
    MobileDataViewRatingComponent,
    MobileDataViewLastTransfersComponent
  ],
  imports: [
    SharedModule,
    DataTableModule
  ],
  exports: [
    MobileDataViewInvestmentComponent,
    MobileDataViewInvestmentClosedComponent,
    MobileDataViewStrategyComponent,
    MobileDataViewRatingComponent,
    MobileDataViewLastTransfersComponent,
  ]
})
export class MobileDataViewModule { }
