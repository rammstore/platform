import { Component, OnInit } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-specification-ratings',
  templateUrl: './specification-ratings.component.html',
  styleUrls: ['./specification-ratings.component.scss']
})
export class SpecificationRatingsComponent{
  links: ContentTabLink[] = [
    new ContentTabLink('rating.rating.title', '/spec/ratings'),
    new ContentTabLink('rating.popular.title', '/spec/ratings/popular'),
    new ContentTabLink('rating.all.title', '/spec/ratings/all')
  ];
}
