import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { map } from 'rxjs/internal/operators';
import { Company, Session, User, Wallet } from '@app/models';
import { AuthData } from '@app/models/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '@app/services/loader.service';
import { CreateInstanceService } from '@app/services/create-instance.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private loaderService: LoaderService,
    private createInstanceService: CreateInstanceService
    ) { }

  login(login: string, password: string): Observable<AuthData> {
    this.loaderService.showLoader();
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {Login: login, Password: password}).pipe(map((response: any) => {

      const session: Session = this.createInstanceService.createSession(response.Session);

      const user: User = this.createInstanceService.createUser(response.Client);

      const wallets: Wallet[] = [];
      response.Wallets.forEach((w: any) => {
        const wallet: Wallet = this.createInstanceService.createWallet(w);
        wallets.push(wallet);
      });

      const company: Company = this.createInstanceService.createCompany(response.Company);

      const authData: AuthData = this.createInstanceService.createAuthData({
        client: user,
        company: company,
        session: session,
        wallets: wallets
      });

      this.storageService.setAuthData(JSON.stringify(authData));
      this.storageService.setToken(authData.session.token);

      this.loaderService.hideLoader();
      return authData;
    }));
  }

  logout(): void {
    this.http.get(`${CONFIG.baseApiUrl}/session.logout`).subscribe(() => {
      this.storageService.removeAuthData();
      this.storageService.removeToken();
      this.router.navigate(['/login']);
    });
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
