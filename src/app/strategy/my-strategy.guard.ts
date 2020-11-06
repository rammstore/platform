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

  getId(str): number {
    return Number(str.substring(str.lastIndexOf('/') + 1) || 0);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isOffers = location.pathname.indexOf('offers');
    const investments = location.pathname.indexOf('investments');
    const myInvestment = location.pathname.indexOf('my-investment');

    let id: number = Number(location.pathname.substring(location.pathname.lastIndexOf('/') + 1) || 0);

    switch (true) {
      case (isOffers > 0): {
        id = this.getId(location.pathname.substring(0, isOffers - 1));
        break;
      }
      case (investments > 0): {
        id = this.getId(location.pathname.substring(0, investments - 1));
        break;
      }
      case (myInvestment > 0): {
        id = this.getId(location.pathname.substring(0, myInvestment - 1));
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
