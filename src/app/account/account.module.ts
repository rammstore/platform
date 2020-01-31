import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { AccountRoutingModule } from './account.routing';
import { AccountComponent } from './account.component';
import { AccountResultsComponent } from './account-results/account-results.component';
import { AccountLastTransfersComponent } from './account-last-transfers/account-last-transfers.component';
import { MobileDataViewModule } from '@app/components/mobile-data-view/mobile-data-view.module';

@NgModule({
  declarations: [
    AccountComponent,
    AccountResultsComponent,
    AccountLastTransfersComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule,
    MobileDataViewModule
  ]
})
export class AccountModule { }
