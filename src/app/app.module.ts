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
import { StrategyService } from '@app/services/strategy.service';
import { OuterConfigModule } from '@app/modules/outer-config/outer-config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletService } from '@app/services/wallet.service';
import { AccountService } from '@app/services/account.service';
import { CommandService } from '@app/services/command.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule
    // OuterConfigModule
  ],
  providers: [
    AuthService,
    UserService,
    StorageService,
    StrategyService,
    WalletService,
    AccountService,
    CommandService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
