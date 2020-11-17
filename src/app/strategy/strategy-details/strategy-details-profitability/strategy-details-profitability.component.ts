import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions, Strategy } from '@app/models';
import * as Highcharts from 'highcharts';
import { Observable, of, Subject } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '@app/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '@app/services/notifications.service';
import { StrategyService } from "@app/services/strategy.service";

const offset = Math.abs(new Date().getTimezoneOffset()) * 60000;
let that: StrategyDetailsProfitabilityComponent;

@Component({
  selector: 'app-strategy-details-profitability',
  templateUrl: './strategy-details-profitability.component.html',
  styleUrls: ['./strategy-details-profitability.component.scss']
})
export class StrategyDetailsProfitabilityComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  strategy$: Observable<Strategy>;
  subscriptions = [];
  // component data
  strategy: Strategy;
  chartOptions: any;
  args: any;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private strategyService: StrategyService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    that = this;
    if (!this.strategyService.strategy) {
      this.id = parseInt(this.route.parent.params['_value'].id);
      if (this.id) {
        this.args = {
          strategyId: this.id
        };

        this.strategy$ = this.getStrategyById(this.args)
          .pipe(
            tap((strategy) => {
              this.checking(strategy);
              this.getStrategyChart(strategy.id);
            })
          );
      }
    } else {
      this.getStrategyFromStrategyService();
    }
  }

  private getStrategyFromStrategyService(): void {
    this.strategy$ = this.strategyService.strategy$
      .pipe(
        tap((strategy) => {
          this.checking(strategy);
          this.getStrategyChart(strategy.id);
        })
      );
  }

  private checking(strategy: Strategy) {
    this.translateService.onDefaultLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        Highcharts.chart('yieldChartContainer', this.chartOptions);
      });
  }

  private getStrategyById(args): Observable<any> {
    return this.dataService.getStrategyById(args)
      .pipe(
        take(1),
        tap(item => {
          this.strategy = new Strategy(item);
        }));
  }

  getStrategyChart(id: number) {
    this.dataService.getStrategyChart(new ChartOptions(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {

        this.chartOptions = {
          credits: {
            enabled: false
          },
          chart: {
            zoomType: 'x',
            backgroundColor: '#f8f8f8'
          },
          title: {
            text: ''
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%e<br>%b',
              month: '%y<br>%b'
            },
            gridLineWidth: 1,
            gridLineColor: '#eaeaea'
          },
          yAxis: {
            labels: {
              format: '{value}%'
            },
            title: {
              text: ''
            },
            gridLineWidth: 1,
            gridLineColor: '#eaeaea',
            startOfWeek: 1
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            useHTML: true,
            formatter: function () {
              return `<div class="arearange-tooltip-header ${this.y < 0 ? 'negative' : ''} ${this.y > 0 ? 'positive' : ''}">` +
                `${Highcharts.numberFormat((this.y), 2, '.')}%</div>` +
                `<div>${that.translateService.instant(getDayName(this.x + offset))}, ${Highcharts.dateFormat('%e %b %Y, %H:%M', this.x + offset)}</div>`;
            }
          },
          type: 'arearange',
          series: [{
            type: 'area',
            lineWidth: 1,
            data: this.getChartDataValues(response.Chart),
            zones: [{
              value: 0,
              color: '#ec151d',
              fillColor: 'rgba(236, 21, 29, .1)'
            }, {
              color: '#00a651',
              fillColor: 'rgba(0, 166, 81, .1'
            }]
          }]
        };

        Highcharts.chart('yieldChartContainer', this.chartOptions);
      });
  }

  getChartDataValues(chartData: any[]) {
    const data: object[] = [];
    chartData.forEach(d => data.push([new Date(d.DT).getTime(), d.Yield]));
    return data;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

function getDayName(time: number) {
  const dayNumber: number = new Date(time).getDay();
  switch (dayNumber) {
    case 0:
      return 'common.week-days.sunday';
    case 1:
      return 'common.week-days.monday';
    case 2:
      return 'common.week-days.tuesday';
    case 3:
      return 'common.week-days.wednesday';
    case 4:
      return 'common.week-days.thursday';
    case 5:
      return 'common.week-days.friday';
    case 6:
      return 'common.week-days.saturday';
  }
}
