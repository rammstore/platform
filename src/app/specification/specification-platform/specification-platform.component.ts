import { Component, OnInit } from '@angular/core';
import { SpecificationService } from '../specification.service';

@Component({
  selector: 'app-specification-platform',
  templateUrl: './specification-platform.component.html',
  styleUrls: ['./specification-platform.component.scss']
})
export class SpecificationPlatformComponent implements OnInit {
  datas: any[] = [];

  spec: any;

  constructor (
    private specService: SpecificationService
  ) {}

  ngOnInit() {
    this.specService.get().subscribe((spec) => {
      this.spec = spec;

      this.datas = [{
        title: 'Счет',
        items: [
          {label: 'Доступные валюты счета', value: this.spec.Account.AvailableCurrency},
          {label: 'Минимальный депозит', value: `${this.spec.Account.MinBalance} ${this.spec.Account.AvailableCurrency}`}
        ]
      }, {
        title: 'common.investments',
        items: [
          {label: 'Минимальный баланс', value: `${this.spec.Account.MinBalance} ${this.spec.Account.AvailableCurrency}`}
        ]
      }, {
        title: 'Стратегии',
        items: [
          {label: 'Минимальная сумма для создания', value: `${this.spec.Strategy.MinAmountToCreate} ${this.spec.Account.AvailableCurrency}`},
          {label: 'common.fee', value: '0 - 50% от прибыли'}
        ]
      }, {
        title: 'Торговый интервал',
        items: [
          {label: 'Период', value: 'Неделя'}
        ]
      }];
    });


  }
}
