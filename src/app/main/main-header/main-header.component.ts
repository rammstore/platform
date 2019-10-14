import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  authData: AuthData;
  isAsideOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  public onClick(event) {
    event.stopPropagation();

    if (event.target.tagName.toLowerCase() === 'aside') {
      return;
    }

    if (event.target.className.toString().includes('sidebar-toggler')) {
      this.toggleAside();
      return;
    }

    this.closeAside();
  }

  constructor(
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.storageService.getAuthData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authData: AuthData) => {
        this.authData = authData;
      });
  }

  isLinkActive(link: string): boolean {
    return this.router.url.startsWith(link);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  toggleAside(): void {
    this.isAsideOpen = !this.isAsideOpen;
  }

  closeAside(): void {
    this.isAsideOpen = false;
  }

  setLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }
}
