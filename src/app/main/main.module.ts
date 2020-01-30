import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { MainComponent } from './main.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainRoutingModule } from './main.routing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}/`, '.json');
}

@NgModule({
  declarations: [
    MainComponent,
    MainHeaderComponent,
    MainFooterComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule,
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
export class MainModule {}
