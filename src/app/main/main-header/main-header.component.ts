import { Component, OnInit } from '@angular/core';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  authData: AuthData;

  chartOptions: any;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authData = this.storageService.getAuthData();

    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: undefined
      },
      connectors: {enabled: false},
      series: [{
        data: [
          ['Доступно', this.authData.getWallets()[0].balance - this.authData.getWallets()[0].invested],
          ['Инвестировано', this.authData.getWallets()[0].invested]
        ],
        colors: ['#f7a35b', '#00a651'],
        innerSize: '50%',
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: false
      }],
      credits: {
        enabled: false
      }
    };

  }

  isLinkActive(link: string): boolean {
    return this.router.url.startsWith(link);
  }

  showChart(): void {
    setTimeout(() => {
      Highcharts.chart('headerChartContainer', this.chartOptions);
    }, 100);
  }

  logout(): void {
    this.authService.logout();
  }
}
