import { Injectable } from '@angular/core';
import { CONFIG } from '../../../config';
import { Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(login: string, password: string): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {userName: login, password: password} );
  }
}
