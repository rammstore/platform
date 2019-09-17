import { Injectable } from '@angular/core';
import { CONFIG } from '../../../config';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { User } from '../user/user';
import { Wallet } from '../user/wallet';
import { UserService } from '../user/user.service';
import { Session } from '../user/session';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  // user: Observable<User>;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    // this.user$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    // this.user = this.user$.asObservable();
  }

  // public get currentUser(): User {
  //   return this.user$.value;
  // }

  login(login: string, password: string): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/session.login`, {Login: login, Password: password} ).pipe(
      map((response: {Client: any, Company: any, Session: any, Wallets: any}) => {

        localStorage.setItem('token', response.Session.Token);
        localStorage.setItem('user', JSON.stringify(response.Client));

        // const session: Session = new Session(
        //   response.Session.Token,
        //   response.Session.WalletID,
        //   response.Session.DTLastActivity,
        //   response.Session.ExpirationMinutes
        // );
        //
        const user: User = new User(
          response.Client.FirstName,
          response.Client.LastName,
          response.Client.Login,
          response.Client.PushToken,
          response.Client.Language
          // session
        );

        // const wallet: Wallet = new Wallet(
        //   response.Wallets.ID
        // )


        // this.user$.next(user);
        //
        // return user;
      })
    );
  }
}
