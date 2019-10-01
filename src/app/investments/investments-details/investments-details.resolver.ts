import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Account } from '@app/models';
import { InvestmentsService } from '@app/services/investments.service';

@Injectable()
export class InvestmentResolver implements Resolve<Account> {

  constructor(
    private investmentsService: InvestmentsService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.investmentsService.get(route.params['id']);
  }
}
