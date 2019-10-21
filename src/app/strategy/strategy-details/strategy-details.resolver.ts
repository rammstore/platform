import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Strategy } from '@app/models';
import { DataService } from '@app/services/data.service';

@Injectable()
export class StrategyResolver implements Resolve<Strategy> {

  constructor(
    private dataService: DataService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.dataService.getStrategy(route.params['id']);
  }
}
