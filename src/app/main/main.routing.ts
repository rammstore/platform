import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      {path: '', redirectTo: 'account'},
      {path: 'account', loadChildren: '../account/account.module#AccountModule'},
      {path: 'strategies', loadChildren: '../strategy/strategy.module#StrategyModule'},
      {path: 'manage', loadChildren: '../manage/manage.module#ManageModule'},
      {path: 'spec', loadChildren: '../specification/specification.module#SpecificationModule'},
      {path: 'help', loadChildren: '../help/help.module#HelpModule'},
      {path: 'investments', loadChildren: '../investments/investments.module#InvestmentsModule'},
      {path: 'rating', loadChildren: '../rating/rating.module#RatingModule'},
      {path: '**', redirectTo: 'account'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
