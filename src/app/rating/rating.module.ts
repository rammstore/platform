import { NgModule } from '@angular/core';
import { RatingComponent } from './rating.component';
import { RatingRatedComponent } from './rating-rated/rating-rated.component';
import { RatingPopularComponent } from './rating-popular/rating-popular.component';
import { RatingAllComponent } from './rating-all/rating-all.component';
import { SharedModule } from '@app/shared.module';
import { RatingRoutingModule } from './rating.routing';
import { MobileDataViewModule } from '@app/components/mobile-data-view/mobile-data-view.module';

@NgModule({
  declarations: [
    RatingComponent,
    RatingRatedComponent,
    RatingPopularComponent,
    RatingAllComponent
  ],
  imports: [
    SharedModule,
    RatingRoutingModule,
    MobileDataViewModule
  ]
})
export class RatingModule { }
