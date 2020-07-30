import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { RouterModule } from '@angular/router';
import { SpecificationInfoBlockComponent } from './components/specification-info-block/specification-info-block.component';
import { ChartWalletInfoComponent } from './components/chart/chart-wallet-info/chart-wallet-info.component';
import { ChartYieldTableComponent } from './components/chart/chart-yield-table/chart-yield-table.component';
import { DialogWrapperModule } from '@app/components/dialog-wrapper/dialog-wrapper.module';
import { ManageModule } from '@app/components/manage/manage.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@app/pipes/pipes.module';
import { ProgressbarModule } from 'ngx-bootstrap';
import { DataTableModule } from '@app/components/data-table/data-table.module';
import { ChartModule } from '@app/components/chart/chart.module';
import { NotificationsModule } from '@app/components/notifications/notifications.module';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    ContentTabsComponent,
    SpecificationInfoBlockComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ProgressbarModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,
    DialogWrapperModule,
    ManageModule,
    TranslateModule,
    PipesModule,
    DataTableModule,
    ChartModule,
    NotificationsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    PopoverModule,
    BsDropdownModule,
    AccordionModule,
    ClipboardModule,
    TooltipModule,
    ModalModule,
    ReactiveFormsModule,
    ContentTabsComponent,
    SpecificationInfoBlockComponent,
    RouterModule,
    ChartWalletInfoComponent,
    ChartYieldTableComponent,
    DialogWrapperModule,
    ManageModule,
    TranslateModule,
    ProgressbarModule,
    PipesModule,
    DataTableModule,
    ChartModule,
    NotificationsModule,
    FormsModule
  ]
})
export class SharedModule { }
