import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecificationPlatformComponent } from './specification-platform/specification-platform.component';
import { SpecificationRatingsAllComponent } from './specification-ratings/specification-ratings-all/specification-ratings-all.component';
import { SpecificationRatingsPopularComponent } from './specification-ratings/specification-ratings-popular/specification-ratings-popular.component';
import { SpecificationRatingsRatedComponent } from './specification-ratings/specification-ratings-rated/specification-ratings-rated.component';
import { SpecificationRatingsComponent } from './specification-ratings/specification-ratings.component';
import { SpecificationComponent } from './specification.component';

const routes: Routes = [
  {
    path: '', component: SpecificationComponent, children: [
      { path: '', component: SpecificationPlatformComponent },
      {
        path: 'ratings', component: SpecificationRatingsComponent, children: [
          { path: '', component: SpecificationRatingsRatedComponent },
          { path: 'popular', component: SpecificationRatingsPopularComponent },
          { path: 'all', component: SpecificationRatingsAllComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecificationRoutingModule { }
