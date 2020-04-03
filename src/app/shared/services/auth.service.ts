import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@assets/config';
import { map } from 'rxjs/internal/operators';
import { Company, Session, User, Wallet } from '@app/models';
import { AuthData } from '@app/models/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '@app/services/loader.service';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WalletService } from '@app/services/wallet.service';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public redirectUrl: string = '/account';
  public otp: string;
  public lang: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private loaderService: LoaderService,
    private createInstanceService: CreateInstanceService,
    private translateService: TranslateService,
    private walletService: WalletService
    ) { }

  login(login: string, password: string): Observable<AuthData> {
    this.loaderService.showLoader();
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {Login: login.trim(), Password: password}).pipe(map((response: any) => {

      const brand: object = {
        brand: {
          brandKey: `${response.Company.BrandKey}`,
          logo: `${window.location.origin}/config/${response.Company.BrandKey}/logo.png`,
          favicon: `${window.location.origin}/config/${response.Company.BrandKey}/favicon.ico`
        },
        languages: {
          en: `${window.location.origin}/config/${response.Company.BrandKey}`,
          ru: '${window.location.origin}/config/${response.Company.BrandKey}'
        }
      };

      localStorage.setItem('brand', JSON.stringify(brand));

      const session: Session = this.createInstanceService.createSession(response.Session);

      response.Client.IDCompany = response.Company.ID;
      const user: User = this.createInstanceService.createUser(response.Client);

      const wallets: Wallet[] = [];
      response.Wallets.forEach((w: any) => {
        const wallet: Wallet = this.createInstanceService.createWallet(w);
        wallets.push(wallet);
      });
      this.walletService.walletSubject.next(wallets[0]);

      const company: Company = this.createInstanceService.createCompany(response.Company);

      const authData: AuthData = this.createInstanceService.createAuthData({
        client: user,
        company: company,
        session: session,
        wallets: wallets
      });

      if (!window.localStorage.getItem('language')) {
        this.translateService.setDefaultLang(authData.client.language);
        this.translateService.use(authData.client.language);
        localStorage.setItem('language', authData.client.language);
      }

      this.storageService.setAuthData(authData);
      this.storageService.setToken(authData.session.token);

      this.loaderService.hideLoader();
      return authData;
    }));
  }

  loginByOtp(otp: string): Observable<AuthData> {
    this.loaderService.showLoader();
    console.log(otp);
    console.log(this.redirectUrl);
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {OTP: otp}).pipe(map((response: any) => {

      const brand: object = {
        brand: {
          brandKey: `${response.Company.BrandKey}`,
          logo: `${window.location.origin}/config/${response.Company.BrandKey}/logo.png`,
          favicon: `${window.location.origin}/config/${response.Company.BrandKey}/favicon.ico`
        },
        languages: {
          en: `${window.location.origin}/config/${response.Company.BrandKey}`,
          ru: '${window.location.origin}/config/${response.Company.BrandKey}'
        }
      };

      localStorage.setItem('brand', JSON.stringify(brand));

      const session: Session = this.createInstanceService.createSession(response.Session);

      response.Client.IDCompany = response.Company.ID;
      const user: User = this.createInstanceService.createUser(response.Client);

      const wallets: Wallet[] = [];
      response.Wallets.forEach((w: any) => {
        const wallet: Wallet = this.createInstanceService.createWallet(w);
        wallets.push(wallet);
      });
      this.walletService.walletSubject.next(wallets[0]);

      const company: Company = this.createInstanceService.createCompany(response.Company);

      const authData: AuthData = this.createInstanceService.createAuthData({
        client: user,
        company: company,
        session: session,
        wallets: wallets
      });

      if (!window.localStorage.getItem('language')) {
        this.translateService.setDefaultLang(authData.client.language);
        this.translateService.use(authData.client.language);
        localStorage.setItem('language', authData.client.language);
      }

      this.storageService.setAuthData(authData);
      this.storageService.setToken(authData.session.token);

      this.loaderService.hideLoader();
      return authData;
    }));
  }

  logout(): void {
    this.http.get(`${CONFIG.baseApiUrl}/session.logout`).subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.storageService.removeAuthData();
    this.storageService.removeToken();
  }

  changePassword(оldPassword: string, password: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${CONFIG.baseApiUrl}/password.set`, {OldPassword: оldPassword, Password: password}).pipe(
      map(() => {
        this.loaderService.hideLoader();
      })
    );
  }

  getToken(): string {
    return this.storageService.getToken();
  }
}
