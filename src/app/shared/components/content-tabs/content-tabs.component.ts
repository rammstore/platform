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

  constructor(private router: Router) {
  }

  isLinkActive(url: string): boolean {
    return this.router.url === url;
  }
}
