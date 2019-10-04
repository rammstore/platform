import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Account } from '@app/models';
import { AccountService } from '@app/services/account.service';

@Injectable()
export class InvestmentResolver implements Resolve<Account> {

  constructor(
    private accountService: AccountService
  ) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.accountService.get(route.params['id']);
  }
}
