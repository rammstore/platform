import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import { BrandService } from '@app/services/brand.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private brandService: BrandService,
    private translateService: TranslateService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // check user logged in.
    // @TODO implement token check via service and API
    if (next.queryParams['lang']) {
      this.authService.lang = next.queryParams['lang'];
      this.translateService.use(next.queryParams['lang']);
      localStorage.setItem('language', next.queryParams['lang']);
    }

    if (next.queryParams['otp']) {
      this.authService.otp = next.queryParams['otp'];
      this.authService.redirectUrl = state.url.split('?')[0];
      this.authService.loginByOtp(next.queryParams['otp']);
      return false;
    }

    if (!localStorage.getItem('auth') || !this.storageService.getToken()) {
      this.authService.redirectUrl = state.url.split('?')[0];
      this.router.navigate(['/login']);
      return false;
    }

    this.brandService.getBrandFile();

    return true;
  }

}
