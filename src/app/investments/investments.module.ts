import { NgModule } from '@angular/core';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsActiveComponent } from './investments-active/investments-active.component';
import { InvestmentsClosedComponent } from './investments-closed/investments-closed.component';
import { InvestmentsRoutingModule } from './investments.routing';
import { SharedModule } from '@app/shared.module';

@NgModule({
  declarations: [InvestmentsComponent, InvestmentsActiveComponent, InvestmentsClosedComponent],
  imports: [
    SharedModule,
    InvestmentsRoutingModule
  ]
})
export class InvestmentsModule { }
