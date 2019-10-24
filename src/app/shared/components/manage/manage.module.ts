import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { ManageAccountFundComponent } from './manage-account-fund/manage-account-fund.component';
import { ManageAccountPauseComponent } from './manage-account-pause/manage-account-pause.component';
import { ManageAccountResumeComponent } from './manage-account-resume/manage-account-resume.component';
import { ManageAccountChangeProfileComponent } from './manage-account-change-profile/manage-account-change-profile.component';
import { ManageAccountWithdrawComponent } from './manage-account-withdraw/manage-account-withdraw.component';
import { ManageStrategyPauseComponent } from './manage-strategy-pause/manage-strategy-pause.component';
import { ManageStrategyResumeComponent } from './manage-strategy-resume/manage-strategy-resume.component';
import { ManageStrategyCloseComponent } from './manage-strategy-close/manage-strategy-close.component';
import { ManageStrategyDownloadScriptComponent } from './manage-strategy-download-script/manage-strategy-download-script.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogWrapperModule } from '@app/components/dialog-wrapper/dialog-wrapper.module';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { ManageStrategyInvestComponent } from './manage-strategy-invest/manage-strategy-invest.component';
import { PipesModule } from '@app/pipes/pipes.module';

@NgModule({
  declarations: [
    ManageComponent,
    ManageAccountFundComponent,
    ManageAccountPauseComponent,
    ManageAccountResumeComponent,
    ManageAccountChangeProfileComponent,
    ManageAccountWithdrawComponent,
    ManageStrategyPauseComponent,
    ManageStrategyResumeComponent,
    ManageStrategyCloseComponent,
    ManageStrategyDownloadScriptComponent,
    ManageStrategyInvestComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    DialogWrapperModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    ManageComponent
  ],
  entryComponents: [
    ManageAccountFundComponent,
    ManageAccountPauseComponent,
    ManageAccountResumeComponent,
    ManageAccountChangeProfileComponent,
    ManageAccountWithdrawComponent,
    ManageStrategyPauseComponent,
    ManageStrategyResumeComponent,
    ManageStrategyCloseComponent,
    ManageStrategyDownloadScriptComponent,
    ManageStrategyInvestComponent
  ]
})
export class ManageModule { }
