import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill.routing';
import { BillResultsComponent } from './bill-results/bill-results.component';
import { BillFundComponent } from './bill-fund/bill-fund.component';
import { BillWithdrawComponent } from './bill-withdraw/bill-withdraw.component';
import { BillLastTransfersComponent } from './bill-last-transfers/bill-last-transfers.component';

const routes: Routes = [
  { path: '', component: BillComponent, children: [
    { path: '', component: BillResultsComponent },
    { path: 'fund', component: BillFundComponent },
    { path: 'withdraw', component: BillWithdrawComponent },
    { path: 'last-transfers', component: BillLastTransfersComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
