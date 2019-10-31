import { NgModule } from '@angular/core';
import { RatingComponent } from './rating.component';
import { RatingRatedComponent } from './rating-rated/rating-rated.component';
import { RatingPopularComponent } from './rating-popular/rating-popular.component';
import { RatingAllComponent } from './rating-all/rating-all.component';
import { SharedModule } from '@app/shared.module';
import { RatingRoutingModule } from './rating.routing';



@NgModule({
  declarations: [
    RatingComponent,
    RatingRatedComponent,
    RatingPopularComponent,
    RatingAllComponent
  ],
  imports: [
    SharedModule,
    RatingRoutingModule
  ]
})
export class RatingModule { }
