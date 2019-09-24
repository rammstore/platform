import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared.module';
import { MainComponent } from './main.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainRoutingModule } from './main.routing';

@NgModule({
  declarations: [
    MainComponent,
    MainHeaderComponent,
    MainFooterComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
