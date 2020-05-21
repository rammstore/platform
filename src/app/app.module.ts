import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from '@app/shared.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import { TokenInterceptor } from '@app/interceptors/token.interceptor';
import { OuterConfigModule } from '@app/modules/outer-config/outer-config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletService } from '@app/services/wallet.service';
import { CommandService } from '@app/services/command.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DataService } from '@app/services/data.service';
import { LoaderService } from '@app/services/loader.service';
import { NotificationsService } from '@app/services/notifications.service';
import { registerLocaleData } from '@angular/common';
import { BrandService } from '@app/services/brand.service';
import localeRu from '@angular/common/locales/ru';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeRu, 'ru');
registerLocaleData(localeEs, 'es');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    StorageService,
    WalletService,
    CommandService,
    DataService,
    LoaderService,
    NotificationsService,
    BrandService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {
}
