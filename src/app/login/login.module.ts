import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
