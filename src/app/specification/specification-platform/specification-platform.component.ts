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
        title: 'common.account',
        items: [
          {label: 'spec.platform.account.currencies.title', value: this.spec.Account.AvailableCurrency},
          {label: 'spec.platform.account.min-deposit.title', value: `${this.spec.Account.MinBalance} ${this.spec.Account.AvailableCurrency}`}
        ]
      }, {
        title: 'common.investments',
        items: [
          {label: 'spec.platform.investments.min-balance.title', value: `${this.spec.Account.MinBalance} ${this.spec.Account.AvailableCurrency}`}
        ]
      }, {
        title: 'spec.platform.strategies.title',
        items: [
          {label: 'spec.platform.strategies.min-sum.title', value: `${this.spec.Strategy.MinAmountToCreate} ${this.spec.Account.AvailableCurrency}`},
          {label: 'common.fee', value: 'spec.platform.strategies.fee.value'}
        ]
      }, {
        title: 'spec.platform.trading-interval.title',
        items: [
          {label: 'spec.platform.trading-interval.period.title', value: 'spec.platform.trading-interval.period.value'}
        ]
      }];
    });


  }
}
