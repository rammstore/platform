import { NgModule } from '@angular/core';
import { InvestmentsComponent } from './investments.component';
import { InvestmentsActiveComponent } from './investments-active/investments-active.component';
import { InvestmentsClosedComponent } from './investments-closed/investments-closed.component';
import { InvestmentsRoutingModule } from './investments.routing';
import { SharedModule } from '@app/shared.module';
import { InvestmentsDetailsComponent } from './investments-details/investments-details.component';
import { InvestmentResolver } from './investments-details/investments-details.resolver';
import { InvestmentsProfileChangeComponent } from './investments-profile-change/investments-profile-change.component';
import { InvestmentsWithdrawComponent } from './investments-withdraw/investments-withdraw.component';
import { InvestmentsDownloadScriptComponent } from './investments-download-script/investments-download-script.component';

@NgModule({
  declarations: [
    InvestmentsComponent,
    InvestmentsActiveComponent,
    InvestmentsClosedComponent,
    InvestmentsDetailsComponent,
    InvestmentsProfileChangeComponent,
    InvestmentsWithdrawComponent,
    InvestmentsDownloadScriptComponent
  ],
  imports: [
    SharedModule,
    InvestmentsRoutingModule
  ],
  providers: [
    InvestmentResolver
  ],
  entryComponents: [
    InvestmentsProfileChangeComponent,
    InvestmentsWithdrawComponent,
    InvestmentsDownloadScriptComponent
  ]
})
export class InvestmentsModule { }
