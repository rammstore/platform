import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('rating.rating.title', '/rating'),
    new ContentTabLink('rating.popular.title', '/rating/popular'),
    new ContentTabLink('rating.all.title', '/rating/all')
  ];
}
