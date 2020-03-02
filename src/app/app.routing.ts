import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { StorageService } from '@app/services/storage.service';


const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: '', loadChildren: './main/main.module#MainModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor (
    private router: Router,
    private storageService: StorageService
  ) {
    this.router.events.subscribe(() => {
      this.storageService.getClient();
    });
  }
}
