import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  { path: '', component: MainComponent, children: [
    { path: '', redirectTo: 'bill', pathMatch: 'full' },
    { path: 'bill', loadChildren: '../bill/bill.module#BillModule' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
