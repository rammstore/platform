import { Component, Input, OnInit } from '@angular/core';
import { Wallet } from '@app/models';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-wallet-info',
  template: ''
})
export class ChartWalletInfoComponent implements OnInit {
  // component data
  @Input() wallet: Wallet;
  @Input() containerID: string;
  chartOptions: object;

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: undefined
      },
      connectors: {
        enabled: false
      },
      series: [{
        data: [
          ['common.available', this.wallet.balance],
          ['Инвестировано', this.wallet.invested]
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

    Highcharts.chart(this.containerID, this.chartOptions);
  }
}
