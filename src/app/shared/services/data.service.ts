import { DefaultIterableDiffer, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, pipe, ReplaySubject, Subject, throwError } from "rxjs";
import {
  Account,
  AccountsSearchOptions,
  ChartOptions,
  Command,
  Deal,
  DealsSearchOptions,
  NotificationOptions,
  Offer,
  Paginator,
  Position,
  PositionsSearchOptions,
  RatingSearchOptions,
  StrategiesSearchOptions,
  Strategy,
  StrategyAccontsOptions
} from "@app/models";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CreateInstanceService } from "@app/services/create-instance.service";
import { CommandService } from "@app/services/command.service";
import { CONFIG } from '@assets/config';
import { catchError, map, takeUntil, tap, filter, take, takeLast, switchMap } from 'rxjs/operators';
import { LoaderService } from '@app/services/loader.service';
import { WalletService } from '@app/services/wallet.service';
import { Router } from '@angular/router';
import { NotificationsService } from '@app/services/notifications.service';
import { AccountSpecAsset } from '@app/models/account-spec-asset';
import { Rating } from '@app/models/rating';
import { Arguments } from "@app/interfaces/args.interface";
import { RatingMapper } from "@app/mappers/rating.mapper";
import { EntityInterface } from '@app/interfaces/entity.interface';
import { AccountMapper } from '@app/mappers/account.mapper';
import { StrategyMapper } from '@app/mappers/strategy.mapper';
import { iUpdateOptions } from '@app/interfaces/update';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  ratingsSubject: BehaviorSubject<Rating[]> = new BehaviorSubject<Rating[]>(null);
  // Мои активные стратегии
  activeMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Мои закрытые стратегии
  closedMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Мои активные инвестиции
  activeMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Мои закрытые инвестиции
  closedMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Детали текущей стратегии
  currentStrategyDetailsSubject: ReplaySubject<Strategy> = new ReplaySubject<Strategy>();
  // Рейтинг стратегий
  ratingStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>(null);
  // Детали текущей инвестиции
  currentAccountStatementSubject: ReplaySubject<any> = new ReplaySubject<any>();
  // Инвестиции текущей стратегии
  currentStrategyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(null);
  // Настройки счетов клиента
  accountSpecAsset: AccountSpecAsset;
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  apiUrl: string = CONFIG.baseApiUrl;
  _update$: BehaviorSubject<iUpdateOptions> = new BehaviorSubject<iUpdateOptions>(null);
  _strategyPage$: ReplaySubject<any> = new ReplaySubject<any>(null);

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService,
    private commandService: CommandService,
    private loaderService: LoaderService,
    private walletService: WalletService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {
    if (!CONFIG.baseApiUrl.startsWith('http')) {
      this.apiUrl = `${window.location.origin}${CONFIG.baseApiUrl}`;
    }
  }

  get update$(): Observable<any> {
    return this._update$.asObservable();
  }

  set strategyPage(value: any) {
    this._strategyPage$.next(value);
  }

  get strategyPage$() {
    return this._strategyPage$.asObservable();
  }

  get getUpdateAsSubject() {
    return this._update$;
  }

  //
  // Методы работы со стратегиями
  //

  // Получение списка активных стратегий
  getActiveMyStrategies(args: Arguments): Observable<EntityInterface> {
    this.loaderService.showLoader();

    const options: any = StrategyMapper.formatArgumentsToOptions(args);

    return this.http.post(`${this.apiUrl}/Strategies.search`, options)
      .pipe(
        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          this.notificationsService.open('notify.loading.error', config);

          return of();
        }),
        take(1),
        tap((item: any) => {

          this.walletService.walletSubject.next(this.createInstanceService.createWallet(item.Wallets[0]));

          if (args.paginator) {
            args.paginator.totalItems = item.Pagination.TotalRecords;
            args.paginator.totalPages = item.Pagination.TotalPages;
          }

          this.loaderService.hideLoader();
        }),
        map(({ Strategies }) => Strategies.map((strategy: Strategy) => this.createInstanceService.createStrategy(strategy)))
      );
  }

  // Получение списка закрытых стратегий
  getClosedMyStrategies(args: Arguments): Observable<Strategy[]> {
    this.loaderService.showLoader();

    const options: any = StrategyMapper.formatArgumentsToOptions(args);

    return this.http.post<EntityInterface>(`${this.apiUrl}/Strategies.search`, options)
      .pipe(
        tap(({ Wallets }) => Wallets ? this.walletService.walletSubject.next(this.createInstanceService.createWallet(Wallets[0])) : ''),
        tap((item) => this.loaderService.hideLoader()),
        tap(({ Pagination }) => {
          if (args.paginator) {
            args.paginator.totalItems = Pagination.TotalRecords;
            args.paginator.totalPages = Pagination.TotalPages;
          }
        }),
        catchError(err => {
          this.notificationsService.open('notify.loading.error', {
            type: 'error',
            autoClose: true,
            duration: 3000
          });
          return of();
        }),
        map(({ Strategies }) => {
          const strategies: Strategy[] = [];
          Strategies.forEach((s: any) => {
            s.PublicOffer = s.PublicOffer || {};
            strategies.push(this.createInstanceService.createStrategy(s));
          });

          return strategies;
        })
      );
  }

  // Получение конкретной стратегии за ID
  getStrategyByID(args: { strategyId: number }): Observable<Strategy> {
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/strategies.get`, { ID: args.strategyId })
      .subscribe((response: any) => {
        this.loaderService.hideLoader();
        this.currentStrategyDetailsSubject.next(this.createInstanceService.createStrategy(response));
      },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/rating']);
            this.notificationsService.open('notify.strategy.access.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          } else {
            this.notificationsService.open('notify.loading.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          }
        });

    return this.currentStrategyDetailsSubject.asObservable();
  }

  getStrategyById(args: { strategyId: number }): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/strategies.get`, { ID: args.strategyId })
      .pipe(
        map((item) => this.createInstanceService.createStrategy(item)),
        tap(item => {
          // debugger
          this.loaderService.hideLoader()
        }),
        catchError((err: HttpErrorResponse) => {
          // debugger
          this.notificationsService.open('empty.strategy.null', {
            type: 'error',
            autoClose: true,
            duration: 3000
          });
          this.router.navigate(['/rating']);
          this.loaderService.hideLoader();
          return of();
        }));
  }

  getStrategyByLinkAsObservable(args: { link: string }): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/strategies.get`, { Link: args.link })
      .pipe(
        map((item) => this.createInstanceService.createStrategy(item)),
        tap(item => this.loaderService.hideLoader())
      );
  }

  // Получение конкретной стратегии за ссылкой
  getStrategyByLink(args: { link: string }): Observable<Strategy> {
    // console.log('getStrategyByLink');
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/strategies.get`, { Link: args.link }).subscribe((response: any) => {
      this.loaderService.hideLoader();
      this.currentStrategyDetailsSubject.next(this.createInstanceService.createStrategy(response));
    }, (error: HttpErrorResponse) => {

      if (error.status === 404) {
        this.router.navigate(['/rating']);
        this.notificationsService.open('notify.strategy.access.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      } else {
        this.notificationsService.open('notify.loading.error', {
          type: 'error',
          autoClose: true,
          duration: 3000
        });
      }
    });

    return this.currentStrategyDetailsSubject.asObservable();
  }

  // Создание новой стратегии
  addStrategy(strategy: object, updateStatus: string, key: string): Observable<Strategy> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.add`, strategy).pipe(
      tap(() => this.loaderService.hideLoader()),
      map((response: any) => {

        // переробити
        this.updateAccount(new Command(response.AccountCommandID, response.AccountID), response.AccountID, updateStatus, key, 'notify.strategy.created');
        this.loaderService.hideLoader();
        return this.createInstanceService.createStrategy({
          ID: response.StrategyID
        });
      })
    );
  }

  setPublicOffer(strategyID: number, offerID?: number) {
    const json: any = {
      StrategyID: strategyID
    };

    if (offerID) {
      json.OfferID = offerID;
    }

    return this.http.post(`${this.apiUrl}/myStrategies.setPublicOffer`, json);
  }

  getOffers(id: number) {
    return this.http.post(`${this.apiUrl}/strategies.getOffers`, {
      StrategyID: id
    })
      .pipe(
        map((item: any) => {
          const array: Offer[] = [];

          (item.Offers || []).forEach((item: any) => {
            array.push(new Offer(item));
          });
          return array;
        }));
  }

  // Создать оферту
  addOffer(id: number, feeRate: number, commissionRate: number): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.addOffer`, {
      StrategyID: id,
      FeeRate: feeRate,
      CommissionRate: commissionRate
    }).pipe(
      map((item) => {
        this.loaderService.hideLoader();

        return item;
      })
    );
  }

  // Постановка стратегии на паузу
  pauseStrategy(strategyId: number, updateStatus: string, key: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.pause`, { StrategyID: strategyId })
      .pipe(
        map((response: any) => {
          this.updateStrategy(new Command(response.CommandID, strategyId), strategyId, updateStatus, key, 'notify.strategy.paused');
          this.loaderService.hideLoader();
        })
      );
  }

  // Возобновление стратегии
  resumeStrategy(strategyId: number, updateStatus: string, key: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.resume`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        this.updateStrategy(new Command(response.CommandID, strategyId), strategyId, updateStatus, key, 'notify.strategy.resumed');
        this.loaderService.hideLoader();
      })
    );
  }

  // Закрытие стратегии
  closeStrategy(strategyId: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/myStrategies.close`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        // this.updateStrategy(new Command(response.CommandID, strategyId), 'notify.strategy.closed');
      })
    );
  }

  getStrategyToken(strategyId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/myStrategies.getToken`, { StrategyID: strategyId }).pipe(
      map((response: any) => {
        return response.Token;
      })
    );
  }

  isStrategyNameUniq(searchQuery: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/myStrategies.checkName`, { Name: searchQuery }).pipe(
      map((response: any) => {
        return !!response.StrategyNameAvailable;
      })
    );
  }

  // Получение статуса команды стратегии и запрос обновленного списка стратегий после завершения обработки изменений
  // Работает с активными стратегиями, так как закрытые изменять нельзя
  updateStrategy(command: Command, strategyId: number, updateStatus: string, key: string, notificationText: string): void {
    const interval = setInterval(() => {
      this.commandService.checkStrategyCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);

          this._update$.next({
            strategyId: strategyId,
            status: updateStatus,
            key: key
          });
// debugger
          this.notificationsService.open(notificationText);

          this.walletService.updateWallet()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.destroy$.next(true);
            });
        }
      });
    }, 1000);
  }

  // Получение графика для стратегий
  getStrategyChart(chartOptions: ChartOptions): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: chartOptions.strategyID,
      MaxPoints: chartOptions.maxPoints,
      chartType: chartOptions.chartType,
      chartSize: chartOptions.chartSize
    };

    this.loaderService.hideLoader();
    return this.http.post(`${this.apiUrl}/charts.get`, options);
  }

  getSymbolsChart(strategyID: number): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: strategyID
    };

    return this.http.post(`${this.apiUrl}/strategysymbolstat.get`, options).pipe(
      map((response: any) => {
        const chart: object[] = [];
        response.StrategySymbolStat.forEach((stat: any) => {
          chart.push({ name: stat.Symbol, y: stat.Share });
        });
        this.loaderService.hideLoader();
        return chart;
      })
    );
  }

  getInvestmentsActiveAccounts(args: any): Observable<EntityInterface> {
    this.loaderService.showLoader();

    const options: any = StrategyMapper.formatToInvestmentsActiveAccountsOptions(args);

    return this.http.post(`${this.apiUrl}/myStrategies.getActiveAccounts`, options).pipe(
      catchError(error => {
        const config: NotificationOptions = {
          type: 'error',
          autoClose: true,
          duration: 3000
        };

        this.notificationsService.open('notify.loading.error', config);

        return of();
      }),
      take(1),
      tap((response: any) => {

        if (args.paginator) {
          args.paginator.totalItems = response.Pagination.TotalRecords;
          args.paginator.totalPages = response.Pagination.TotalPages;
        }

        this.loaderService.hideLoader();
      }),
      map(({ Accounts }) => Accounts.map((account: Account) => this.createInstanceService.createAccount(account)))
    )
  }

  getInvestmentsClosedAccounts(args: any): Observable<EntityInterface> {
    this.loaderService.showLoader();

    const options: any = StrategyMapper.formatToInvestmentsActiveAccountsOptions(args);

    return this.http.post(`${this.apiUrl}/myStrategies.getClosedAccounts`, options).pipe(
      catchError(error => {
        const config: NotificationOptions = {
          type: 'error',
          autoClose: true,
          duration: 3000
        };

        this.notificationsService.open('notify.loading.error', config);

        return of();
      }),
      take(1),
      tap((response: any) => {

        if (args.paginator) {
          args.paginator.totalItems = response.Pagination.TotalRecords;
          args.paginator.totalPages = response.Pagination.TotalPages;
        }

        this.loaderService.hideLoader();
      }),
      map(({ Accounts }) => Accounts.map((account: Account) => this.createInstanceService.createAccount(account)))
    )
  }

  //
  // Методы работы с инвестициями
  //

  // Получение списка активных инвестиций
  getActiveMyAccounts(args: Arguments): Observable<EntityInterface> {
    this.loaderService.showLoader();

    const options: any = AccountMapper.formatArgumentsToOptions(args);

    return this.http.post(`${this.apiUrl}/strategies.search`, options)
      .pipe(
        catchError(error => {
          // debugger
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          this.notificationsService.open('notify.loading.error', config);

          return of();
        }),
        take(1),
        tap((item: any) => {
          // debugger
          this.walletService.walletSubject.next(this.createInstanceService.createWallet(item.Wallets[0]));

          if (args.paginator) {
            args.paginator.totalItems = item.Pagination.TotalRecords;
            args.paginator.totalPages = item.Pagination.TotalPages;
          }

          this.loaderService.hideLoader();
        }),
        map(({ Strategies }) => Strategies.map((strategy) => {
          const createStrategy = this.createInstanceService.createStrategy(strategy);
          const createAccount = this.createInstanceService.createAccount(strategy.Account);

          createAccount.strategy = createStrategy;
          createAccount.offer = strategy.offer ? this.createInstanceService.createOffer(strategy.Offer) : null;

          return createAccount;
        }))
      );
  }

  getClosedMyAccounts(args: Arguments): Observable<EntityInterface> {
    this.loaderService.showLoader();

    const options: any = AccountMapper.formatArgumentsToOptions(args);

    return this.http.post(`${this.apiUrl}/accounts.searchClosed`, options)
      .pipe(
        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          this.notificationsService.open('notify.loading.error', config);

          return of()
        }),
        take(1),
        tap((item: any) => {
          this.walletService.walletSubject.next(this.createInstanceService.createWallet(item.Wallets[0]));

          if (args.paginator) {
            args.paginator.totalItems = item.Pagination.TotalRecords;
            args.paginator.totalPages = item.Pagination.TotalPages;
          }

          this.loaderService.hideLoader();
        }),
        map(({ Strategies }) => Strategies.map((strategy) => {
          let account: Account;

          if (strategy.Account) {
            const createStrategy = this.createInstanceService.createStrategy(strategy);
            account = this.createInstanceService.createAccount(strategy.Account);
            account.strategy = createStrategy;
          }

          return account;
        }))
      );
  }

  getAccountById(accountId: number): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.get`, { AccountID: accountId })
      .pipe(

        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          switch (error.status) {
            case 404: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
              break;
            }
            case 401: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
              break;
            }
            default: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
            }
          }

          this.loaderService.hideLoader();

          return of();
        }), take(1),
        map((response: any) => {
          const data = {
            strategy: this.createInstanceService.createStrategy(response.Strategy),
            account: this.createInstanceService.createAccount(response.Account)
          }
          return data;
        }
        ),
        tap(item => this.loaderService.hideLoader())
      )
  }

  // Получение деталей инвестиции
  getAccountStatement(args: { accountId: number }): Observable<any> {
    this.loaderService.showLoader();
    this.http.post(`${this.apiUrl}/accounts.get`, { AccountID: args.accountId })
      .pipe(
        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          switch (error.status) {
            case 404: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
              break;
            }
            case 401: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
              break;
            }
            default: {
              this.router.navigate(['/investments']);
              this.notificationsService.open('empty.investment.null', config);
            }
          }

          this.loaderService.hideLoader()
          return of();
        })
      )
      .subscribe((response: any) => {
        if (response.Strategy) {
          response.Strategy.PublicOffer = {
            CommissionRate: response.Strategy.Commission,
            FeeRate: response.Strategy.Fee
          };
          this.currentAccountStatementSubject.next({
            strategy: this.createInstanceService.createStrategy(response.Strategy),
            account: this.createInstanceService.createAccount(response.Account)

          });
        } else {
          this.currentAccountStatementSubject.next({
            strategy: null,
            account: null
          });
        }

        this.loaderService.hideLoader();
      },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.router.navigate(['/investments']);
            this.notificationsService.open('notify.investment.access.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          } else {
            this.router.navigate(['/investments']);
            this.notificationsService.open('notify.loading.error', {
              type: 'error',
              autoClose: true,
              duration: 3000
            });
          }
        });

    return this.currentAccountStatementSubject.asObservable();
  }

  // Инвестировать в стратегию по публичной оферте
  addAccountPublicOffer(id: number, data: object): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      StrategyID: id,
      OfferID: data['offerId'],
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${this.apiUrl}/accounts.add`, options).pipe(
      map((response: any) => {
        // this.getActiveMyStrategies().subscribe();
        this.walletService.updateWallet().subscribe();
        this.getStrategyByID({ strategyId: id });
        // this.updateRatingList();
        this.notificationsService.open('notify.investment.created');
      })
    );
  }

  // Инвестировать в стратегию по cкрытой ссылке
  addAccountPrivateOffer(link: string, data: object): Observable<any> {
    this.loaderService.showLoader();
    const options: any = {
      Link: link,
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${this.apiUrl}/accounts.add`, options).pipe(
      map((response: any) => {
        // this.getActiveMyStrategies().subscribe();
        this.walletService.updateWallet().subscribe();
        this.getStrategyByLink({ link: link });
        // this.updateRatingList();
        this.notificationsService.open('notify.investment.created');
      })
    );
  }

  // Пополнить инвестицию
  fundAccount(accountId: number, amount: number, updateStatus: string, key: string) {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.fund`, { AccountID: accountId, Amount: amount }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandBalanceID, accountId), accountId, updateStatus, key, 'notify.investment.funded');
      })
    );
  }

  // Приостановить инвестицию
  pauseAccount(accountId: number, updateStatus: string, key: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.pause`, { AccountID: accountId })
      .pipe(
        map((response: any) => {
          this.updateAccount(new Command(response.CommandID, accountId), accountId, updateStatus, key, 'notify.investment.paused');
        })
      );
  }

  // Возобновить инвестицию
  resumeAccount(accountId: number, updateStatus: string, key: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.resume`, { AccountID: accountId }).pipe(
      map((response: any) => {
        this.updateAccount(new Command(response.CommandID, accountId), accountId, updateStatus, key, 'notify.investment.resumed');
      })
    );
  }

  // Изменить профиль инвестиции
  changeAccountProfile(accountId: number, valueObj: { [key: string]: number }, updateStatus: string, key: string): Observable<any> {
    this.loaderService.showLoader();

    const requests: any[] = [];

    if (valueObj.target) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setTarget`, {
          AccountID: accountId,
          Target: valueObj['target']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountId), accountId, updateStatus, key, 'notify.investment.target.changed');
          })
        )
      );
    }

    if (valueObj.protection) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setProtection`, {
          AccountID: accountId,
          Protection: valueObj['protection']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountId), accountId, updateStatus, key, 'notify.investment.protection.changed');
          })
        )
      );
    }

    if (valueObj.factor) {
      requests.push(
        this.http.post(`${this.apiUrl}/accounts.setFactor`, {
          AccountID: accountId,
          Factor: valueObj['factor']
        }).pipe(
          map((response: any) => {
            this.updateAccount(new Command(response.CommandID, accountId), accountId, updateStatus, key, 'notify.investment.factor.changed');
          })
        )
      );
    }

    if (!requests.length) {
      this.loaderService.hideLoader();
      return of(null);
    }

    return forkJoin(requests);
  }

  // Вывести средства из инвестиции
  withdrawFromAccount(accountId: number, amount: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.withdraw`, { AccountID: accountId, Amount: amount }).pipe(
      map((response: any) => {
        // this.updateAccount(new Command(response.CommandBalanceID, accountId), methodName, methodArgs, 'notify.investment.withdrawn');
      })
    );
  }

  // Закрыть инвестицию
  closeAccount(accountID: number, methodName: string, methodArgs: any): Observable<any> {
    this.loaderService.showLoader();
    return this.http.post(`${this.apiUrl}/accounts.close`, { AccountID: accountID }).pipe(
      map((response: any) => {
        // this.updateAccount(new Command(response.CommandID, accountID), methodName, methodArgs, 'notify.investment.closed');
      })
    );
  }

  // Получение статуса команды и запрос обновленного списка дынных после завершения обработки изменений
  updateAccount(command: Command, accountId: number, updateStatus: string, key: string, notificationText: string): void {
    const interval = setInterval(() => {
      this.commandService.checkAccountCommand(command).subscribe((commandStatus: number) => {
        // debugger
        this._update$.next({
          accountId: accountId,
          status: updateStatus,
          key: key
        });
        if (commandStatus !== 0) {
          clearInterval(interval);

          this.notificationsService.open(notificationText);

          this.walletService.updateWallet()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.destroy$.next(true);
            });
        }
      });

    }, 1000);
  }

  // Получение списка сделок по инвестиции
  getAccountDeals(id: number, pagination?: Paginator): Observable<object> {
    this.loaderService.showLoader();
    const options: DealsSearchOptions = new DealsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${this.apiUrl}/deals.search`, options).pipe(map((response: any) => {
      const result: { deals: Deal[], totals: object } = {
        deals: [],
        totals: {
          yield: response.DealsTotal.Profit,
          totalProfit: response.DealsTotal.TotalProfit,
          swap: response.DealsTotal.Swap,
          commission: response.DealsTotal.Commission
        }
      };

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Deals.forEach((deal: any) => {
        result.deals.push(this.createInstanceService.createDeal(deal));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      return result;
    }));
  }

  // Получение списка позиций по инвестиции
  getAccountPositions(id: number, pagination?: Paginator): Observable<object> {
    this.loaderService.showLoader();
    const options: PositionsSearchOptions = new PositionsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${this.apiUrl}/positions.search`, options).pipe(map((response: any) => {
      const result: { positions: Position[], totals: object } = {
        positions: [],
        totals: {
          profit: response.PositionsTotal.Profit,
          totalProfit: response.PositionsTotal.TotalProfit,
          swap: response.PositionsTotal.Swap
        }
      };

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      if (response.Positions.length) {
        response.Positions.forEach((position: any) => {
          result.positions.push(this.createInstanceService.createPosition(position));
        });

        if (pagination) {
          pagination.totalItems = response.Pagination.TotalRecords;
          pagination.totalPages = response.Pagination.TotalPages;
        }
      }

      this.loaderService.hideLoader();
      return result;
    }));
  }

  //
  // Методы для работы с рейтингом
  //

  getRating(args: { ageMin?: number, dealsMin?: number, yieldMin?: number, searchMode?: string, field?: string, paginator?: Paginator, searchText?: string, direction?: string })
    : Observable<Strategy[]> {
    this.loaderService.showLoader();
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      SearchMode: args.searchMode,
      AgeMin: args.ageMin,
      YieldMin: args.yieldMin,
      DealsMin: args.dealsMin
    };

    if (args.searchText) {
      options.Filter.Name = args.searchText;
    }

    options.OrderBy = {
      Field: args.field,
      Direction: args.direction
    };

    if (args.paginator) {
      options.Pagination = {
        CurrentPage: args.paginator.currentPage,
        PerPage: args.paginator.perPage
      };
    }

    this.http.post(`${this.apiUrl}/strategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      this.walletService.walletSubject.next(this.createInstanceService.createWallet(response.Wallets[0]));

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (args.paginator) {
        args.paginator.totalItems = response.Pagination.TotalRecords;
        args.paginator.totalPages = response.Pagination.TotalPages;
      }

      this.loaderService.hideLoader();
      this.ratingStrategiesSubject.next(strategies);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.ratingStrategiesSubject.asObservable();
  }

  getBestRating(args: Arguments): Observable<EntityInterface> {
    this.loaderService.showLoader();
    const options: any = RatingMapper.formatArgumentsToOptions(args);

    return this.http.post(`${this.apiUrl}/strategies.search`, options)
      .pipe(
        take(1),
        catchError(error => {
          const config: NotificationOptions = {
            type: 'error',
            autoClose: true,
            duration: 3000
          };

          this.notificationsService.open('notify.loading.error', config);

          return of();
        }),
        tap((item: any) => {
          if (args.paginator) {
            args.paginator.totalItems = item.Pagination.TotalRecords;
            args.paginator.totalPages = item.Pagination.TotalPages;
          }
          this.walletService.walletSubject.next(this.createInstanceService.createWallet(item.Wallets[0]));

          this.loaderService.hideLoader();
        }),
        map(({ Strategies }) => Strategies.map((item) => this.createInstanceService.createStrategy(item)))

      );
  }

  getAccountSpecAsset(): void {
    this.http.get(`${this.apiUrl}/accounts.searchSpec`).subscribe((response: any) => {
      this.accountSpecAsset = this.createInstanceService.createAccountSpecAsset(response.AccountSpecAsset[0]);
    });
  }

  getBrandRatings(): Observable<any[]> {
    const url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;
    const linkOptions: string = `${url}/options.json`;

    this.http.get(linkOptions).subscribe((result: any) => {
      const ratings: any[] = [];

      (result.Ratings || []).forEach((rating: any) => {
        ratings.push(rating);
      });
      this.ratingsSubject.next(ratings);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.ratingsSubject.asObservable();
  }

  getOptionsRatings(): Observable<any> {
    const url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;

    return this.http.get(`${url}/options.json`);
  }
}
