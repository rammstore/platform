import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePasswordComponent } from './manage-password/manage-password.component';

const routes: Routes = [
  { path: '', component: ManagePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
