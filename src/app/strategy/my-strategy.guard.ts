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
export class MyStrategyGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
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
    const myInvestments = location.pathname.indexOf('my-investment');
    const symbols = location.pathname.indexOf('symbols');

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
      case (myInvestments > 0): {
        id = this.getId(location.pathname.substring(0, myInvestments - 1));
        break;
      }
      case(symbols > 0):{
        id = this.getId(location.pathname.substring(0, symbols - 1));
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

              (isOffers > 0) ? this.setNotification(config, MessageEnum.offers) : '';
              (investments > 0) ? this.setNotification(config, MessageEnum.investment) : '';

              break;
            }
            default: {
              (isOffers > 0) ? this.setNotification(config, MessageEnum.offers) : '';
              (investments > 0) ? this.setNotification(config, MessageEnum.investment) : '';
            }
          }

          return of();
        }),
        map(item => item.isMyStrategy),
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
