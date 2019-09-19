import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill.routing';
import { BillResultsComponent } from './bill-results/bill-results.component';
import { BillFundComponent } from './bill-fund/bill-fund.component';
import { BillWithdrawComponent } from './bill-withdraw/bill-withdraw.component';
import { BillLastTransfersComponent } from './bill-last-transfers/bill-last-transfers.component';

@NgModule({
  declarations: [
    BillComponent,
    BillResultsComponent,
    BillFundComponent,
    BillWithdrawComponent,
    BillLastTransfersComponent
  ],
  imports: [
    SharedModule,
    BillRoutingModule
  ]
})
export class BillModule { }
