import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification-ratings-rated',
  templateUrl: './specification-ratings-rated.component.html',
  styleUrls: ['./specification-ratings-rated.component.scss']
})
export class SpecificationRatingsRatedComponent implements OnInit {

  data: any = {
    title: 'spec.rating.conditions.title',
    items: [
      {label: 'spec.rating.life-term.title', value: '90'},
      {label: 'spec.rating.min-deals-number.title', value: '0'},
      {label: 'spec.rating.last-activity-time.title', value: 'spec.rating.last-activity-time.value'},
      {label: 'spec.rating.min-yield.title', value: 'spec.rating.min-yield.value'}
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
