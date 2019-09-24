import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { map, tap } from 'rxjs/internal/operators';
import { Company, Session, User, Wallet } from '@app/user';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Observable } from 'rxjs/index';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
    ) { }

  login(login: string, password: string): Observable<AuthData> {
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {Login: login, Password: password}).pipe(map((response: any) => {

      const session: Session = new Session(
        response.Session.Token,
        response.Session.WalletID,
        response.Session.DTLastActivity,
        response.Session.ExpirationMinutes
      );

      const user: User = new User(
        response.Client.FirstName,
        response.Client.LastName,
        response.Client.Login,
        response.Client.PushToken,
        response.Client.Language
      );

      const wallets: Wallet[] = [];

      response.Wallets.forEach((w: any) => {
        const wallet: Wallet = new Wallet(
          w.ActiveStrategiesCount,
          w.Asset,
          w.Balance,
          w.DT,
          w.ID,
          w.IDClient,
          w.IntervalPnL,
          w.Invested,
          w.Margin,
          w.Status,
        );

        wallets.push(wallet);
      });

      const company: Company = new Company(
        response.Company.Name,
        response.Company.Demo,
        response.Company.Contacts
      );

      const authData: AuthData = new AuthData({
        client: user,
        company: company,
        session: session,
        wallets: wallets
      });

      this.storageService.setAuthData(JSON.stringify(authData));
      this.storageService.setToken(authData.session.token);

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
    return this.http.post(`${CONFIG.baseApiUrl}/password.set`, {OldPassword: оldPassword,Password: password});
  }

  getToken(): string {
    return this.storageService.getToken();
  }
}
