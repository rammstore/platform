import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { AccordionModule, BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component';
import { RouterModule } from '@angular/router';
import { DialogWrapperComponent } from './components/dialog-wrapper/dialog-wrapper.component';
import { SpecificationInfoBlockComponent } from './components/specification-info-block/specification-info-block.component';
import { ChartWalletInfoComponent } from './components/chart/chart-wallet-info/chart-wallet-info.component';

@NgModule({
  declarations: [
    ContentTabsComponent,
    DialogWrapperComponent,
    SpecificationInfoBlockComponent,
    ChartWalletInfoComponent
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
    ChartWalletInfoComponent
  ],
  providers: [
    PercentPipe
  ]
})
export class SharedModule { }
