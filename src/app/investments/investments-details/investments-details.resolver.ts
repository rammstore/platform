import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Account } from '@app/models';
import { DataService } from '@app/services/data.service';

@Injectable()
export class InvestmentResolver implements Resolve<Account> {

  constructor(
    private dataService: DataService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.dataService.getAccount(route.params['id']);
  }
}
