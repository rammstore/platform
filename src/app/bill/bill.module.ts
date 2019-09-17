import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill.routing';

@NgModule({
  declarations: [BillComponent],
  imports: [
    SharedModule,
    BillRoutingModule
  ]
})
export class BillModule { }
