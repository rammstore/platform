import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    LoginRoutingModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
