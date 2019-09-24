import { NgModule } from '@angular/core';
import { StrategyComponent } from './strategy.component';
import { StrategyActiveComponent } from './strategy-active/strategy-active.component';
import { StrategyClosedComponent } from './strategy-closed/strategy-closed.component';
import { SharedModule } from '@app/shared.module';
import { StrategyRoutingModule } from './strategy.routing';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { StrategyPauseComponent } from './strategy-pause/strategy-pause.component';
import { StrategyResumeComponent } from './strategy-resume/strategy-resume.component';
import { StrategyFundComponent } from './strategy-fund/strategy-fund.component';

@NgModule({
  declarations: [
    StrategyComponent,
    StrategyActiveComponent,
    StrategyClosedComponent,
    StrategyAddComponent,
    StrategyPauseComponent,
    StrategyResumeComponent,
    StrategyFundComponent
  ],
  imports: [
    SharedModule,
    StrategyRoutingModule
  ],
  entryComponents: [
    StrategyAddComponent,
    StrategyPauseComponent,
    StrategyResumeComponent,
    StrategyFundComponent
  ]
})
export class StrategyModule { }
