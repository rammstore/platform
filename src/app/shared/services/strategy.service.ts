import {Injectable} from '@angular/core';
import {Strategy} from "@app/models";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: null
})
export class StrategyService {
  private _strategy: BehaviorSubject<Strategy> = new BehaviorSubject<Strategy>(null);
  private strategyData: Strategy;

  constructor() {
  }

  get strategy$(): Observable<Strategy> {
    return this._strategy.asObservable();
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
