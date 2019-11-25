import { Component, Input } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.scss']
})
export class ContentTabsComponent {
  @Input() links: ContentTabLink[];

  constructor(
    private router: Router
  ) {}

  isLinkActive(url: string, link?: ContentTabLink): boolean {
    console.log(url);
    console.log(this.router.url);
    console.log(this.links);
    console.log('-------------');
    let result: boolean = false;

    if (this.isStrategyInvestmentsClosedCheck(url, link)) {
      result = true;
    } else {
      result = this.router.url === url;
    }

    return result;
  }

  isStrategyInvestmentsClosedCheck(url: string, link: ContentTabLink): boolean {
    if (this.router.url.includes('strategies/details') && this.router.url.includes('investments/closed') && url.includes('strategies/details') && url.includes('investments') && link.name === 'Инвестиции') {
      return true;
    } else {
      return false;
    }
  }
}
