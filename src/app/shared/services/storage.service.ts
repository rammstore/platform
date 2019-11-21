import { Injectable } from '@angular/core';
import { AuthData, User, Company, Session, Wallet } from '@app/models';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  authDataSubject: ReplaySubject<AuthData> = new ReplaySubject<AuthData>();

  constructor() { }

  setAuthData(data: AuthData): void {
    this.authDataSubject.next(data);
    localStorage.setItem('auth', JSON.stringify(data));
  }

  getAuthData(): Observable<AuthData> {
    return this.authDataSubject.asObservable();
  }

  removeAuthData(): void {
    this.authDataSubject.next(null);
    localStorage.removeItem('auth');
  }

  setToken(data: string ): void {
    localStorage.setItem('token', data);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getWallet(): Wallet {
    return JSON.parse(localStorage.getItem('auth')).wallets[0];
  }

  getClient(): User {
    return JSON.parse(localStorage.getItem('auth')).client;

  }

  getSession(): Session {
    return JSON.parse(localStorage.getItem('auth')).session;

  }
}
