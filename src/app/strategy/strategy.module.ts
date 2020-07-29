import { NgModule } from '@angular/core';
import { StrategyComponent } from './strategy.component';
import { StrategyActiveComponent } from './strategy-active/strategy-active.component';
import { StrategyClosedComponent } from './strategy-closed/strategy-closed.component';
import { SharedModule } from '@app/shared.module';
import { StrategyRoutingModule } from './strategy.routing';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { StrategyDetailsComponent } from './strategy-details/strategy-details.component';
import { StrategyDetailsProfitabilityComponent } from './strategy-details/strategy-details-profitability/strategy-details-profitability.component';
import { StrategyDetailsSymbolsComponent } from './strategy-details/strategy-details-symbols/strategy-details-symbols.component';
import { StrategyDetailsInvestmentsComponent } from './strategy-details/strategy-details-investments/strategy-details-investments.component';
import { MobileDataViewModule } from '@app/components/mobile-data-view/mobile-data-view.module';
import { StrategyDetailsInvestmentsActiveComponent } from './strategy-details/strategy-details-investments/strategy-details-investments-active/strategy-details-investments-active.component';
import { StrategyDetailsInvestmentsClosedComponent } from './strategy-details/strategy-details-investments/strategy-details-investments-closed/strategy-details-investments-closed.component';
import { StrategyAddScriptComponent } from './strategy-add/strategy-add-script/strategy-add-script.component';
import { StrategyOffersComponent } from './strategy-details/strategy-offers/strategy-offers.component';
import { StrategyOfferCreateComponent } from './strategy-details/strategy-offers/strategy-offer-create/strategy-offer-create.component';

@NgModule({
  declarations: [
    StrategyComponent,
    StrategyActiveComponent,
    StrategyClosedComponent,
    StrategyAddComponent,
    StrategyDetailsComponent,
    StrategyDetailsProfitabilityComponent,
    StrategyDetailsSymbolsComponent,
    StrategyDetailsInvestmentsComponent,
    StrategyDetailsInvestmentsActiveComponent,
    StrategyDetailsInvestmentsClosedComponent,
    StrategyAddScriptComponent,
    StrategyOffersComponent,
    StrategyOfferCreateComponent
  ],
  imports: [
    SharedModule,
    StrategyRoutingModule,
    MobileDataViewModule
  ],
  entryComponents: [
    StrategyAddComponent,
    StrategyOfferCreateComponent,
    StrategyAddScriptComponent
  ]
})
export class StrategyModule { }
