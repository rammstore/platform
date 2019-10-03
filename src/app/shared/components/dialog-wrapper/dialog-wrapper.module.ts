import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogWrapperComponent } from '@app/components/dialog-wrapper/dialog-wrapper.component';
import { ModalModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [
    DialogWrapperComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [
    DialogWrapperComponent
  ],
})
export class DialogWrapperModule { }
