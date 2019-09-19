import { NgModule } from '@angular/core';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { SharedModule } from '@app/shared.module';
import { ManageRoutingModule } from './manage.routing';

@NgModule({
  declarations: [ManagePasswordComponent],
  imports: [
    SharedModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
