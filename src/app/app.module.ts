import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from '@app/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserService } from '@app/user/user.service';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import { TokenInterceptor } from '@app/interceptors/token.interceptor';
import { AccountService } from '@app/services/account.service';
import { StrategyService } from '@app/services/strategy.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    UserService,
    StorageService,
    AccountService,
    StrategyService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
