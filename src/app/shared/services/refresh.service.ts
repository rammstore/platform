import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RefreshService {
  private _refresh$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  get refresh$(){
    return this._refresh$.asObservable();
  }

  set refresh(value: any){
    this._refresh$.next(value);
  }
}
