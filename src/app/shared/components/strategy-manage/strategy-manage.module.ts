import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyManageComponent } from '@app/components/strategy-manage/strategy-manage.component';
import { RouterModule } from '@angular/router';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { StrategyManageFundComponent } from './strategy-manage-fund/strategy-manage-fund.component';
import { StrategyManagePauseComponent } from './strategy-manage-pause/strategy-manage-pause.component';
import { StrategyManageResumeComponent } from './strategy-manage-resume/strategy-manage-resume.component';
import { StrategyManageChangeInvestmentProfileComponent } from './strategy-manage-change-investment-profile/strategy-manage-change-investment-profile.component';
import { StrategyManageChangeInvestmentWithdrawComponent } from './strategy-manage-change-investment-withdraw/strategy-manage-change-investment-withdraw.component';
import { StrategyManageCloseComponent } from './strategy-manage-close/strategy-manage-close.component';
import { StrategyManageDownloadScriptComponent } from './strategy-manage-download-script/strategy-manage-download-script.component';
import { DialogWrapperModule } from '@app/components/dialog-wrapper/dialog-wrapper.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StrategyManageComponent,
    StrategyManageFundComponent,
    StrategyManagePauseComponent,
    StrategyManageResumeComponent,
    StrategyManageChangeInvestmentProfileComponent,
    StrategyManageChangeInvestmentWithdrawComponent,
    StrategyManageCloseComponent,
    StrategyManageDownloadScriptComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    DialogWrapperModule,
    ReactiveFormsModule
  ],
  exports: [
    StrategyManageComponent
  ],
  entryComponents: [
    StrategyManageFundComponent,
    StrategyManagePauseComponent,
    StrategyManageResumeComponent,
    StrategyManageChangeInvestmentProfileComponent,
    StrategyManageChangeInvestmentWithdrawComponent,
    StrategyManageCloseComponent,
    StrategyManageDownloadScriptComponent
  ]
})
export class StrategyManageModule { }
