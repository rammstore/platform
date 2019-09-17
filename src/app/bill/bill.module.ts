import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillComponent } from './bill.component';
import { RouterModule, Routes } from '@angular/router';

const billRoutes: Routes = [
  { path: '', component: BillComponent }
];

@NgModule({
  declarations: [BillComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(billRoutes)
  ]
})
export class BillModule { }
