import { Injectable } from '@angular/core';
import { Argument } from '@app/models/argument';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArgumentsService {
  private _ratingRated$: BehaviorSubject<Argument> = new BehaviorSubject<Argument>(null);
  private _ratingPopular$: BehaviorSubject<Argument> = new BehaviorSubject<Argument>(null);
  private _ratingAll$: BehaviorSubject<Argument> = new BehaviorSubject<Argument>(null);
  private all: Argument;
  private popular: Argument;
  private rated: Argument;


  constructor() { }

  get ratingRated$(): Observable<Argument> {
    return this._ratingRated$.asObservable();
  }

  get retingRated(): Argument {
    return this.rated;
  }

  get getRatingRatedAsSubject() {
    return this._ratingRated$;
  }

  set retingRated(value: Argument) {
    this._ratingRated$.next(value);
    this.rated = value;
  }


  get ratingPopular$(): Observable<Argument> {
    return this._ratingPopular$.asObservable();
  }

  get retingPopular(): Argument {
    return this.popular;
  }

  get getRatingPopularAsSubject() {
    return this._ratingPopular$;
  }

  set retingPopular(value: Argument) {
    this._ratingPopular$.next(value);
    this.popular = value;
  }


  get ratingAll$(): Observable<Argument> {
    return this._ratingAll$.asObservable();
  }

  get retingAll(): Argument {
    return this.all;
  }

  get getRatingAllAsSubject() {
    return this._ratingAll$;
  }

  set retingAll(value: Argument) {
    this._ratingAll$.next(value);
    this.all = value;
  }
}
