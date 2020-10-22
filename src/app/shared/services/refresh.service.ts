import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RefreshService {
  private _refresh$: ReplaySubject<any> = new ReplaySubject<any>(null);

  constructor() { }

  get refresh$(){
    return this._refresh$.asObservable();
  }

  set refresh(value: any){
    this._refresh$.next(value);
  }
}
