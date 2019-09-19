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
  }

  getUser(): Observable<User> {
    return this.user$.asObservable();
  }

  getWallet(): Observable<Wallet> {
    return this.wallet$.asObservable();
  }
}
