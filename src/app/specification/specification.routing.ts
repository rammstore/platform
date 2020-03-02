import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecificationPlatformComponent } from './specification-platform/specification-platform.component';
import { SpecificationRatingComponent } from './specification-rating/specification-rating.component';
import { SpecificationComponent } from './specification.component';

const routes: Routes = [
  { path: '', component: SpecificationComponent, children: [
    { path: '', component: SpecificationPlatformComponent },
    { path: 'rating', component: SpecificationRatingComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecificationRoutingModule { }
