import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RatingComponent } from './rating.component';
import { RatingRatedComponent } from './rating-rated/rating-rated.component';
import { RatingPopularComponent } from './rating-popular/rating-popular.component';
import { RatingAllComponent } from './rating-all/rating-all.component';

const routes: Routes = [
  { path: '', component: RatingComponent, children: [
      { path: '', component: RatingRatedComponent },
      { path: 'popular', component: RatingPopularComponent },
      { path: 'all', component: RatingAllComponent }
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingRoutingModule { }
