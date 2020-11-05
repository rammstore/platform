import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {DataService} from "@app/services/data.service";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MyStrategyGuard implements CanActivate {
  constructor(
    private router: Router,
    private dataService: DataService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isOffers = location.pathname.indexOf('offers');
    const isInvestment = location.pathname.indexOf('investments');
    let str = '';
    let id: number = Number(location.pathname.substring(location.pathname.lastIndexOf('/') + 1) || 0);

    switch (true) {
      case (isOffers > 0): {
        str = location.pathname.substring(0, isOffers - 1);
        id = Number(str.substring(str.lastIndexOf('/') + 1) || 0);
        break;
      }
      case (isInvestment > 0): {
        str = location.pathname.substring(0, isInvestment - 1);
        id = Number(str.substring(str.lastIndexOf('/') + 1) || 0);
        break;
      }
    }

    return this.dataService.getStrategyById({strategyId: id})
      .pipe(
        map(item => item.isMyStrategy),
        tap((check) => !check ? this.router.navigate(['/strategies/details/', id]) : '')
      );
  }
}
