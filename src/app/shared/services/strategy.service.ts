import {Injectable} from '@angular/core';
import {Strategy} from "@app/models";
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class StrategyService {
  private _strategy: BehaviorSubject<Strategy> = new BehaviorSubject<Strategy>(null);
  private _update: ReplaySubject<any> = new ReplaySubject<any>();
  private strategyData: Strategy;

  constructor() {
  }

  get strategy$(): Observable<Strategy> {
    return this._strategy.asObservable();
  }

  get update$() {
    return this._update.asObservable();
  }

  set update(value: any) {
    this._update.next(value);
  }

  get strategy(): Strategy {
    return this.strategyData;
  }

  get getStrategyAsSubject(){
    return this._strategy;
  }

  set strategy(value: Strategy) {
    this._strategy.next(value);
    this.strategyData = value;
  }
}
