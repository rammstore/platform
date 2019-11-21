import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // check user logged in.
    // @TODO implement token check via service and API
    if (!localStorage.getItem('auth') || !this.storageService.getToken()) {
      this.authService.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

}
