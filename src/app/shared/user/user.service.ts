import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { User } from './user';
import { Wallet } from './wallet';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  // user: Observable<User>;

  private wallet$: BehaviorSubject<Wallet> = new BehaviorSubject<Wallet>(null);
  // wallet: Observable<Wallet>;

  constructor() {
    // this.user$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    // this.user = this.user$.asObservable();
  }

  setUser(user: User): void {
    this.user$.next(user);
  }

  getUser(): Observable<User> {
    return this.user$.asObservable();
  }

  setWallet(wallet: Wallet): void {
    this.wallet$.next(wallet);
  }

  getWallet(): Observable<Wallet> {
    return this.wallet$.asObservable();
  }
}
