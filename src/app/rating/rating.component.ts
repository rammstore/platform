import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('Рейтинг', '/rating'),
    new ContentTabLink('Популярные', '/rating/popular'),
    new ContentTabLink('Все стратегии', '/rating/all')
  ];
}
