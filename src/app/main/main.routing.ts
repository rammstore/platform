import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  { path: '', component: MainComponent, children: [
    { path: '', redirectTo: 'bill' },
    { path: 'bill', loadChildren: '../bill/bill.module#BillModule' },
    { path: 'strategies', loadChildren: '../strategy/strategy.module#StrategyModule' },
    { path: 'manage', loadChildren: '../manage/manage.module#ManageModule' },
    { path: 'spec', loadChildren: '../specification/specification.module#SpecificationModule' },
    { path: 'help', loadChildren: '../help/help.module#HelpModule' },
    { path: 'investments', loadChildren: '../investments/investments.module#InvestmentsModule' },
    { path: 'rating', loadChildren: '../rating/rating.module#RatingModule' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
