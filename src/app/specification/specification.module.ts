import { NgModule } from '@angular/core';

import { SpecificationPlatformComponent } from './specification-platform/specification-platform.component';
import { SpecificationComponent } from './specification.component';
import { SpecificationRoutingModule } from './specification.routing';
import { SharedModule } from '@app/shared.module';
import { SpecificationService } from './specification.service';
import { SpecificationRatingsComponent } from './specification-ratings/specification-ratings.component';
import { SpecificationRatingsAllComponent } from './specification-ratings/specification-ratings-all/specification-ratings-all.component';
import { SpecificationRatingsPopularComponent } from './specification-ratings/specification-ratings-popular/specification-ratings-popular.component';
import { SpecificationRatingsRatedComponent } from './specification-ratings/specification-ratings-rated/specification-ratings-rated.component';

@NgModule({
  declarations: [
    SpecificationPlatformComponent,
    SpecificationComponent,
    SpecificationRatingsComponent,
    SpecificationRatingsAllComponent,
    SpecificationRatingsPopularComponent,
    SpecificationRatingsRatedComponent
  ],
  imports: [
    SharedModule,
    SpecificationRoutingModule
  ],
  providers: [
    SpecificationService
  ]
})
export class SpecificationModule { }
