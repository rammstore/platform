import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.scss']
})
export class ContentTabsComponent {
  @Input() links: ContentTabLink[];
  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router
  ) {}

  isLinkActive(url: string, link?: ContentTabLink): boolean {
    return (this.isStrategyInvestmentsClosedCheck(url, link)) ? true : (this.router.url === url);
  }

  onClick() {
    this.change.emit();
  }

  isStrategyInvestmentsClosedCheck(url: string, link: ContentTabLink): boolean {
    if (this.router.url.includes('strategies/details') && this.router.url.includes('investments/closed') && url.includes('strategies/details') && url.includes('investments') && url.includes('ratings') && link.name === 'common.investments') {
      return true;
    } else {
      return false;
    }
  }
}
