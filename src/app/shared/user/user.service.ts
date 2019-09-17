import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  user: Observable<User>;

  constructor() {
    this.user$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.user = this.user$.asObservable();
  }

  public get currentUser(): User {
    return this.user$.value;
  }

  setUser(user: User): void {
    this.user$.next(user);
  }

  getUser(): Observable<User> {
    return this.user$.asObservable();
  }
}
