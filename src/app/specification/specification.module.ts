import { NgModule } from '@angular/core';

import { SpecificationPlatformComponent } from './specification-platform/specification-platform.component';
import { SpecificationRatingComponent } from './specification-rating/specification-rating.component';
import { SpecificationComponent } from './specification.component';
import { SpecificationRoutingModule } from './specification.routing';
import { SharedModule } from '@app/shared.module';



@NgModule({
  declarations: [
    SpecificationPlatformComponent,
    SpecificationRatingComponent,
    SpecificationComponent
  ],
  imports: [
    SharedModule,
    SpecificationRoutingModule
  ]
})
export class SpecificationModule { }
