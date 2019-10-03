import { NgModule } from '@angular/core';
import { StrategyComponent } from './strategy.component';
import { StrategyActiveComponent } from './strategy-active/strategy-active.component';
import { StrategyClosedComponent } from './strategy-closed/strategy-closed.component';
import { SharedModule } from '@app/shared.module';
import { StrategyRoutingModule } from './strategy.routing';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { StrategyDetailsComponent } from './strategy-details/strategy-details.component';
import { StrategyResolver } from './strategy-details/strategy-details.resolver';
import { StrategyDetailsProfitabilityComponent } from './strategy-details/strategy-details-profitability/strategy-details-profitability.component';
import { StrategyDetailsSymbolsComponent } from './strategy-details/strategy-details-symbols/strategy-details-symbols.component';
import { StrategyDetailsInvestmentsComponent } from './strategy-details/strategy-details-investments/strategy-details-investments.component';

@NgModule({
  declarations: [
    StrategyComponent,
    StrategyActiveComponent,
    StrategyClosedComponent,
    StrategyAddComponent,
    StrategyDetailsComponent,
    StrategyDetailsProfitabilityComponent,
    StrategyDetailsSymbolsComponent,
    StrategyDetailsInvestmentsComponent
  ],
  imports: [
    SharedModule,
    StrategyRoutingModule
  ],
  entryComponents: [
    StrategyAddComponent
  ],
  providers: [
    StrategyResolver
  ]
})
export class StrategyModule { }
