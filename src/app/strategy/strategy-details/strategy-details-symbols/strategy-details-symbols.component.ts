import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-strategy-details-symbols',
  templateUrl: './strategy-details-symbols.component.html',
  styleUrls: ['./strategy-details-symbols.component.scss']
})
export class StrategyDetailsSymbolsComponent implements OnInit {
  strategy: Strategy;
  chartOptions: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe((data: object) => {
      this.strategy = data['strategy'];
      console.log(this.strategy);

      this.chartOptions = {
        title: {
          text: ''
        },
        legend: {
          enabled: false
        },
        tooltip: {
          useHTML: true,
          headerFormat: '',
          pointFormatter: function () {
            return `<div class="arearange-tooltip-header">${Highcharts.numberFormat((this.y), 2, '.')}%</div>`;
          }
        },
        type: 'arearange',
        series: [{
          type: 'pie',
          name: this.strategy.symbols,
          data: [{
            y: 100,
            name: this.strategy.symbols
          }]
        }]
      };

      Highcharts.chart('symbolsChartContainer', this.chartOptions);
    });
  }

}
