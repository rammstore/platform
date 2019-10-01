import { NgModule } from '@angular/core';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsActiveComponent } from './investments-active/investments-active.component';
import { InvestmentsClosedComponent } from './investments-closed/investments-closed.component';
import { InvestmentsRoutingModule } from './investments.routing';
import { SharedModule } from '@app/shared.module';
import { InvestmentsDetailsComponent } from './investments-details/investments-details.component';
import { InvestmentResolver } from './investments-details/investments-details.resolver';

@NgModule({
  declarations: [
    InvestmentsComponent,
    InvestmentsActiveComponent,
    InvestmentsClosedComponent,
    InvestmentsDetailsComponent
  ],
  imports: [
    SharedModule,
    InvestmentsRoutingModule
  ],
  providers: [
    InvestmentResolver
  ]
})
export class InvestmentsModule { }
