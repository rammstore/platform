import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '@app/components/data-table/data-table.component';
import { DataTablePaginatorComponent } from '@app/components/data-table/data-table-paginator/data-table-paginator.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '@app/pipes/pipes.module';
import { ManageModule } from '@app/components/manage/manage.module';
import { ChartModule } from '@app/components/chart/chart.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DataTableComponent,
    DataTablePaginatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    ManageModule,
    ChartModule,
    TranslateModule
  ],
  exports: [
    DataTableComponent,
    DataTablePaginatorComponent
  ]
})
export class DataTableModule { }
