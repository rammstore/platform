import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartWalletInfoComponent } from '@app/components/chart/chart-wallet-info/chart-wallet-info.component';
import { ChartYieldTableComponent } from '@app/components/chart/chart-yield-table/chart-yield-table.component';



@NgModule({
  declarations: [
    ChartWalletInfoComponent,
    ChartYieldTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChartWalletInfoComponent,
    ChartYieldTableComponent
  ]
})
export class ChartModule { }
