import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { User, Wallet } from '@app/models';
import { StorageService } from '@app/services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { TranslateService } from '@ngx-translate/core';
import { WalletService } from '@app/services/wallet.service';

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
  client: User;
  wallet: Wallet;
  isAsideOpen: boolean = false;
  language: string;

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
    private translateService: TranslateService,
    private walletService: WalletService
  ) {
  }

  ngOnInit(): void {
    this.client = this.storageService.getClient();

    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
        this.wallet = wallet;
      });

    if (window.localStorage.getItem('language')) {
      this.language = window.localStorage.getItem('language');
    } else {
      this.language = this.client.language;
    }
  }

  isLinkActive(link: string): boolean {
    return this.router.url === link;
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
    // this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.language = lang;
    localStorage.setItem('language', lang);
    location.reload();
  }
}
