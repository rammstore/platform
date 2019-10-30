import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillComponent } from './bill.component';
import { BillResultsComponent } from './bill-results/bill-results.component';
import { BillLastTransfersComponent } from './bill-last-transfers/bill-last-transfers.component';

const routes: Routes = [
  { path: '', component: BillComponent, children: [
    { path: '', component: BillResultsComponent },
    { path: 'last-transfers', component: BillLastTransfersComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
