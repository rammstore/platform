import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  isWrongCredentials: boolean = false;
  redirectUrl: string[] = ['/account'];
  language: string;
  otp: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['lang']) {
      this.language = this.route.snapshot.queryParams['lang'];
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { otp: this.route.snapshot.queryParams['otp'] }});
      this.setLanguage(this.language);
    }

    if (this.router.url.split('?')[0] !== '/login') {
      this.redirectUrl = [this.router.url.split('?')[0]];
      this.authService.redirectUrl = this.redirectUrl[0];
    }

    if (this.route.snapshot.queryParams['otp']) {
      this.otp = this.route.snapshot.queryParams['otp'];
      this.authService.loginByOtp(this.otp)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.router.navigate(this.redirectUrl);
        }, (e: HttpErrorResponse) => {
          if (e.status === 401) {
            this.isWrongCredentials = true;
          }
        });
    } else {
      this.language = this.translateService.currentLang;
      this.buildForm();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    this.isWrongCredentials = false;

    this.authService.login(this.form.getRawValue().login, this.form.getRawValue().password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.authService.redirectUrl) {
          this.redirectUrl = [this.authService.redirectUrl];
          this.authService.redirectUrl = '/';
        }
        this.router.navigate(this.redirectUrl);
      }, (e: HttpErrorResponse) => {
        if (e.status === 401) {
          this.isWrongCredentials = true;
        }
      });
  }

  setLanguage(lang: string) {
    if (this.translateService.currentLang !== lang) {
      this.translateService.use(lang);
      this.language = lang;
      localStorage.setItem('language', lang);
      location.reload();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
