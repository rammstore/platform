import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StrategyComponent} from './strategy.component';
import {StrategyActiveComponent} from './strategy-active/strategy-active.component';
import {StrategyClosedComponent} from './strategy-closed/strategy-closed.component';
import {StrategyDetailsComponent} from './strategy-details/strategy-details.component';
import {StrategyDetailsProfitabilityComponent} from './strategy-details/strategy-details-profitability/strategy-details-profitability.component';
import {StrategyDetailsSymbolsComponent} from './strategy-details/strategy-details-symbols/strategy-details-symbols.component';
import {StrategyDetailsInvestmentsComponent} from './strategy-details/strategy-details-investments/strategy-details-investments.component';
import {StrategyDetailsInvestmentsActiveComponent} from './strategy-details/strategy-details-investments/strategy-details-investments-active/strategy-details-investments-active.component';
import {StrategyDetailsInvestmentsClosedComponent} from './strategy-details/strategy-details-investments/strategy-details-investments-closed/strategy-details-investments-closed.component';
import {StrategyOffersComponent} from './strategy-details/strategy-offers/strategy-offers.component';
import {StrategyDetailsMyInvestmentComponent} from './strategy-details/strategy-details-my-investment/strategy-details-my-investment.component';
import {StrategyLinkComponent} from './strategy-details/strategy-link/strategy-link.component';
import {MyStrategyGuard} from './my-strategy.guard';
import {MyInvestmentGuard} from "./my-investment.guard";

const routes: Routes = [
  {
    path: '', component: StrategyComponent, children: [
      {path: '', component: StrategyActiveComponent},
      {path: 'closed', component: StrategyClosedComponent}
    ]
  },
  {
    path: 'details/:id', component: StrategyDetailsComponent, children: [
      {path: '', component: StrategyDetailsProfitabilityComponent},
      {path: 'offers', canActivate: [MyStrategyGuard], component: StrategyOffersComponent},
      {path: 'symbols', component: StrategyDetailsSymbolsComponent},
      {path: 'my-investment', canActivate: [MyStrategyGuard], component: StrategyDetailsMyInvestmentComponent},
      {
        path: 'investments',
        canActivate: [MyStrategyGuard],
        component: StrategyDetailsInvestmentsComponent, children: [
          {path: '', component: StrategyDetailsInvestmentsActiveComponent},
          {path: 'closed', component: StrategyDetailsInvestmentsClosedComponent}
        ]
      }
    ]
  },
  {
    path: 'link/:id', component: StrategyLinkComponent, children: [
      { path: '', component: StrategyDetailsProfitabilityComponent},
      {path: 'offers', component: StrategyOffersComponent},
      {path: 'symbols', component: StrategyDetailsSymbolsComponent},
      {path: 'my-investment', component: StrategyDetailsMyInvestmentComponent},
      {
        path: 'investments', component: StrategyDetailsInvestmentsComponent, children: [
          {path: '', component: StrategyDetailsInvestmentsActiveComponent},
          {path: 'closed', component: StrategyDetailsInvestmentsClosedComponent}
        ]
      },
      {path: 'symbols', component: StrategyDetailsSymbolsComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategyRoutingModule {
}
