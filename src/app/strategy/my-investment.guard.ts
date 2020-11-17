import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {DataService} from '@app/services/data.service';
import {catchError, map, tap} from 'rxjs/operators';
import {NotificationOptions} from '@app/models';
import {NotificationsService} from '@app/services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MyInvestmentGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private dataService: DataService) {
  }

  private getId(str): number {
    return Number(str.substring(str.lastIndexOf('/') + 1) || 0);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const myInvestment = location.pathname.indexOf('my-investment');

    let id: number = Number(location.pathname.substring(location.pathname.lastIndexOf('/') + 1) || 0);

    switch (true) {
      case (myInvestment > 0): {
        id = this.getId(location.pathname.substring(0, myInvestment - 1));
        break;
      }
    }

    return this.dataService.getStrategyById({strategyId: id})
      .pipe(
        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 5000
          };

          switch (error.status) {
            case 404:
            case 401: {
              this.router.navigate(['/strategies/details/', id]);
              break;
            }
            default: {
            }
          }

          return of();
        }),
        map(item => item.account && item.account.status !== 6),
        tap((check) => !check ? this.router.navigate(['/strategies/details/', id]) : '')
      );
  }

  setNotification(config: any, message: MessageEnum) {
    this.notificationsService.open(Description[message], config);
  }
}

const Description = {
  offers: 'empty.offers.null',
  investment: 'empty.investment.null'
}

enum MessageEnum {
  offers = 'offers',
  investment = 'investment'
}
