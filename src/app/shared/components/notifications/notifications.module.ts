import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { AlertModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [NotificationsComponent],
  exports: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    AlertModule.forRoot()
  ]
})
export class NotificationsModule { }
