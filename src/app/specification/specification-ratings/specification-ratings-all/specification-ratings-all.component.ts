import { Component, OnInit } from '@angular/core';
import { BrandService } from '@app/services/brand.service';

@Component({
  selector: 'app-specification-ratings-all',
  templateUrl: './specification-ratings-all.component.html',
  styleUrls: ['./specification-ratings-all.component.scss']
})
export class SpecificationRatingsAllComponent implements OnInit {

  data: any = {
    title: 'spec.rating.conditions.title',
    items: [
      {label: 'spec.rating.life-term.title', value: '0'},
      {label: 'spec.rating.min-deals-number.title', value: '0'},
      {label: 'spec.rating.last-activity-time.title', value: 'spec.rating.last-activity-time.value'},
      {label: 'spec.rating.min-yield.title', value: 'spec.rating.min-yield.value'}
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
