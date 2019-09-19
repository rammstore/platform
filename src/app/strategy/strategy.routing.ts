import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StrategyComponent } from './strategy.component';
import { StrategyActiveComponent } from './strategy-active/strategy-active.component';
import { StrategyClosedComponent } from './strategy-closed/strategy-closed.component';

const routes: Routes = [
  { path: '', component: StrategyComponent, children: [
    { path: '', component: StrategyActiveComponent },
    { path: 'closed', component: StrategyClosedComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategyRoutingModule { }
