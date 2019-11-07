import { Component, OnInit } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { ActivatedRoute } from '@angular/router';
import { Paginator } from '@app/models';

@Component({
  selector: 'app-strategy-details-investments',
  templateUrl: './strategy-details-investments.component.html',
  styleUrls: ['./strategy-details-investments.component.scss']
})
export class StrategyDetailsInvestmentsComponent implements OnInit {
  links: ContentTabLink[];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.links = [
      new ContentTabLink('Активные', '/strategies/details/' + this.route.parent.params['_value'].id + '/investments'),
      new ContentTabLink('Закрытые', '/strategies/details/' + this.route.parent.params['_value'].id + '/investments/closed')
    ];
  }
}
