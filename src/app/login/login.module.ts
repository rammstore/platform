import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { LoginComponent } from './login.component';
import { LoginService } from '@app/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    LoginRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }
