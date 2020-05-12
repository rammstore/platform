import { Component } from '@angular/core';

@Component({
  selector: 'app-specification-rating',
  templateUrl: './specification-rating.component.html',
  styleUrls: ['./specification-rating.component.scss']
})
export class SpecificationRatingComponent {
  data: any = {
    title: 'spec.rating.conditions.title',
    items: [
      {label: 'spec.rating.life-term.title', value: '30'},
      {label: 'spec.rating.min-positions-number.title', value: '0'},
      {label: 'spec.rating.last-activity-time.title', value: 'spec.rating.last-activity-time.value'},
      {label: 'spec.rating.min-yield.title', value: 'spec.rating.min-yield.value'}
    ]
  };
}
