import { NgModule } from '@angular/core';
import { StrategyComponent } from './strategy.component';
import { StrategyActiveComponent } from './strategy-active/strategy-active.component';
import { StrategyClosedComponent } from './strategy-closed/strategy-closed.component';
import { SharedModule } from '@app/shared.module';
import { StrategyRoutingModule } from './strategy.routing';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';

@NgModule({
  declarations: [StrategyComponent, StrategyActiveComponent, StrategyClosedComponent, StrategyAddComponent],
  imports: [
    SharedModule,
    StrategyRoutingModule
  ]
})
export class StrategyModule { }
