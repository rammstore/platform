import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { AlertModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [NotificationsComponent],
  exports: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    TranslateModule
  ]
})
export class NotificationsModule { }
