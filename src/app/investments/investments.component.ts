import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss']
})
export class InvestmentsComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('Активные', '/investments'),
    new ContentTabLink('Закрытые', '/investments/closed')
  ];
}
