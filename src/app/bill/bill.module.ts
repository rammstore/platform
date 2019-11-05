import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { BillRoutingModule } from './bill.routing';
import { BillComponent } from './bill.component';
import { BillResultsComponent } from './bill-results/bill-results.component';
import { BillLastTransfersComponent } from './bill-last-transfers/bill-last-transfers.component';
import { MobileDataViewModule } from '@app/components/mobile-data-view/mobile-data-view.module';

@NgModule({
  declarations: [
    BillComponent,
    BillResultsComponent,
    BillLastTransfersComponent
  ],
  imports: [
    SharedModule,
    BillRoutingModule,
    MobileDataViewModule
  ]
})
export class BillModule { }
