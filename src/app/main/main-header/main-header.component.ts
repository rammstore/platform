import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

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

  constructor(
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
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
}
