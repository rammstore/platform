import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { AccordionModule, BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { RouterModule } from '@angular/router';
import { SpecificationInfoBlockComponent } from './components/specification-info-block/specification-info-block.component';
import { ChartWalletInfoComponent } from './components/chart/chart-wallet-info/chart-wallet-info.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { ChartYieldTableComponent } from './components/chart/chart-yield-table/chart-yield-table.component';
import { DataTablePaginatorComponent } from './components/data-table/data-table-paginator/data-table-paginator.component';
import { StrategyManageModule } from '@app/components/strategy-manage/strategy-manage.module';
import { DialogWrapperModule } from '@app/components/dialog-wrapper/dialog-wrapper.module';

@NgModule({
  declarations: [
    ContentTabsComponent,
    SpecificationInfoBlockComponent,
    ChartWalletInfoComponent,
    DataTableComponent,
    DynamicPipe,
    ChartYieldTableComponent,
    DataTablePaginatorComponent
  ],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,
    StrategyManageModule,
    DialogWrapperModule
  ],
  exports: [
    CommonModule,
    PopoverModule,
    BsDropdownModule,
    AccordionModule,
    TooltipModule,
    ModalModule,
    ReactiveFormsModule,
    ContentTabsComponent,
    SpecificationInfoBlockComponent,
    RouterModule,
    ChartWalletInfoComponent,
    DataTableComponent,
    ChartYieldTableComponent,
    StrategyManageModule,
    DialogWrapperModule
  ],
  providers: [
    DynamicPipe,
    PercentPipe,
    CurrencyPipe,
    DatePipe
  ]
})
export class SharedModule { }
