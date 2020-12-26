import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { Rating } from '@app/models/rating';
import { BrandService } from '@app/services/brand.service';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('spec.platform.title', '/spec'),
    new ContentTabLink('spec.rating.title', '/spec/ratings',
      [
        new ContentTabLink('rating.rating.title', '/rating'),
        new ContentTabLink('rating.popular.title', '/rating/popular'),
        new ContentTabLink('rating.all.title', '/rating/all')
      ])
  ];


}
