import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('spec.platform.title', '/spec'),
    new ContentTabLink('spec.rating.title', '/spec/rating')
  ];
}
