import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { BillRoutingModule } from './bill.routing';
import { BillComponent } from './bill.component';
import { BillResultsComponent } from './bill-results/bill-results.component';
import { BillLastTransfersComponent } from './bill-last-transfers/bill-last-transfers.component';

@NgModule({
  declarations: [
    BillComponent,
    BillResultsComponent,
    BillLastTransfersComponent
  ],
  imports: [
    SharedModule,
    BillRoutingModule
  ]
})
export class BillModule { }
