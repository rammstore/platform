import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Strategy } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-investments-details',
  templateUrl: './investments-details.component.html',
  styleUrls: ['./investments-details.component.scss']
})
export class InvestmentsDetailsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account: Account;
  strategy: Strategy;
  links: ContentTabLink[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getAccountStatement(this.route.params['_value'].id).subscribe((response: any) => {
      this.strategy = response.strategy;
      this.account = response.account;
      this.account.strategy = response.strategy;

      this.links = [
        new ContentTabLink('Позиции', '/investments/details/' + this.account.id),
        new ContentTabLink('Сделки', '/investments/details/' + this.account.id + '/deals')
      ];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
