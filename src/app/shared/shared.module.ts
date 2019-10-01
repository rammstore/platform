import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { AccordionModule, BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { RouterModule } from '@angular/router';
import { DialogWrapperComponent } from './components/dialog-wrapper/dialog-wrapper.component';
import { SpecificationInfoBlockComponent } from './components/specification-info-block/specification-info-block.component';
import { ChartWalletInfoComponent } from './components/chart/chart-wallet-info/chart-wallet-info.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { StrategyManageComponent } from './components/strategy-manage/strategy-manage.component';
import { DynamicPipe } from './pipes/dynamic.pipe';
import { ChartYieldTableComponent } from './components/chart/chart-yield-table/chart-yield-table.component';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { DataTablePaginatorComponent } from './components/data-table/data-table-paginator/data-table-paginator.component';
registerLocaleData(localeRu);

@NgModule({
  declarations: [
    ContentTabsComponent,
    DialogWrapperComponent,
    SpecificationInfoBlockComponent,
    ChartWalletInfoComponent,
    DataTableComponent,
    StrategyManageComponent,
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
    RouterModule
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
    DialogWrapperComponent,
    SpecificationInfoBlockComponent,
    RouterModule,
    ChartWalletInfoComponent,
    DataTableComponent,
    StrategyManageComponent,
    ChartYieldTableComponent
  ],
  providers: [
    DynamicPipe,
    PercentPipe,
    CurrencyPipe,
    DatePipe
  ]
})
export class SharedModule { }
