import { Injectable } from '@angular/core';
import { AuthData } from '@app/user/auth-data';
import { User } from '../user/user';
import { Company } from '../user/company';
import { Session } from '../user/session';
import { Wallet } from '../user/wallet';
import { BehaviorSubject, Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName = 'sessionStorage';
  authDataSubject: BehaviorSubject<AuthData> = new BehaviorSubject(null);

  constructor() { }

  setAuthData(data: string) {
    window[this.storageName].setItem('auth', data);
    this.authDataSubject.next(this.createAuthData(JSON.parse(data)));
    return this;
  }

  getAuthData(): Observable<AuthData> {
    const authData = JSON.parse(window[this.storageName].getItem('auth'));
    this.authDataSubject.next(this.createAuthData(authData));

    return this.authDataSubject.asObservable();
  }

  removeAuthData() {
    window[this.storageName].removeItem('auth');
    this.authDataSubject.next(null);
    return this;
  }

  createAuthData(authData: any): AuthData {
    const client: User = new User();
    Object.assign(client, authData.client);

    const company: Company = new Company();
    Object.assign(company, authData.company);

    const session: Session = new Session();
    Object.assign(session, authData.session);

    const wallets: Wallet[] = [];
    authData.wallets.forEach((w: any) => {
      const wallet: Wallet = new Wallet();
      Object.assign(wallet, w);

      wallets.push(wallet);
    });

    return new AuthData({client: client, company: company, session: session, wallets: wallets});
  }

  setToken(data: string ) {
    window[this.storageName].setItem('token', data);

    return this;
  }

  removeToken() {
    window[this.storageName].removeItem('token');

    return this;
  }

  getToken(): string {
    return window[this.storageName].getItem('token');
  }
}
