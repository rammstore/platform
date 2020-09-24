import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification-ratings-popular',
  templateUrl: './specification-ratings-popular.component.html',
  styleUrls: ['./specification-ratings-popular.component.scss']
})
export class SpecificationRatingsPopularComponent implements OnInit {

  data: any = {
    title: 'spec.rating.conditions.title',
    items: [
      {label: 'spec.rating.life-term.title', value: '30'},
      {label: 'spec.rating.min-deals-number.title', value: '0'},
      {label: 'spec.rating.last-activity-time.title', value: 'spec.rating.last-activity-time.value'},
      {label: 'spec.rating.min-yield.title', value: 'spec.rating.min-yield.value'}
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
