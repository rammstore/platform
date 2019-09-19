import { Injectable } from '@angular/core';
import { AuthData } from '@app/user/auth-data';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName = 'sessionStorage';

  constructor() { }

  setAuthData(data: string ) {
    window[this.storageName].setItem('auth', data);

    return this;
  }

  getAuthData(): AuthData {
    return new AuthData(JSON.parse(window[this.storageName].getItem('auth')));
  }

  removeAuthData() {
    window[this.storageName].removeItem('auth');

    return this;
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
