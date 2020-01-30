import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { AccountRoutingModule } from './account.routing';
import { AccountComponent } from './account.component';
import { AccountResultsComponent } from './account-results/account-results.component';
import { AccountLastTransfersComponent } from './account-last-transfers/account-last-transfers.component';
import { MobileDataViewModule } from '@app/components/mobile-data-view/mobile-data-view.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}/`, '.json');
}

@NgModule({
  declarations: [
    AccountComponent,
    AccountResultsComponent,
    AccountLastTransfersComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule,
    MobileDataViewModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})
export class AccountModule { }
