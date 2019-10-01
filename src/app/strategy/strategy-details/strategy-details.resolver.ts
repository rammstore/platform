import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StrategyService } from '@app/services/strategy.service';
import { Strategy } from '@app/models';
import { of } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';

@Injectable()
export class StrategyResolver implements Resolve<Strategy> {

  constructor(
    private strategyService: StrategyService,
    private router: Router
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.strategyService.get(route.params['id']);
  }
}
