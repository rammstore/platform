import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsActiveComponent } from './investments-active/investments-active.component';
import { InvestmentsClosedComponent } from './investments-closed/investments-closed.component';
import { InvestmentsDetailsComponent } from './investments-details/investments-details.component';
import { InvestmentResolver } from './investments-details/investments-details.resolver';

const routes: Routes = [
  { path: '', component: InvestmentsComponent, children: [
    { path: '', component: InvestmentsActiveComponent },
    { path: 'closed', component: InvestmentsClosedComponent }
  ] },
  { path: 'details/:id', component: InvestmentsDetailsComponent, resolve: { investment: InvestmentResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentsRoutingModule { }
