import { Injectable } from '@angular/core';
import { AuthData } from '@app/models/auth-data';
import { User, Company, Session, Wallet } from '@app/models';
import { CreateInstanceService } from '@app/services/create-instance.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName = 'sessionStorage';

  constructor(
    private createInstanceService: CreateInstanceService
  ) { }

  setAuthData(data: string): void {
    window[this.storageName].setItem('auth', data);
  }

  getAuthData(): AuthData {
    return JSON.parse(window[this.storageName].getItem('auth'));
  }

  removeAuthData(): void {
    window[this.storageName].removeItem('auth');
  }

  setToken(data: string ): void {
    window[this.storageName].setItem('token', data);
  }

  removeToken(): void {
    window[this.storageName].removeItem('token');
  }

  getToken(): string {
    return window[this.storageName].getItem('token');
  }

  getWallet(): Wallet {
    return this.getAuthData().wallets[0];
  }

  getClient(): User {
    return this.getAuthData().client;
  }

  getSession(): Session {
    return this.getAuthData().session;
  }

  getCompany(): Company {
    return this.getAuthData().company;
  }
}
