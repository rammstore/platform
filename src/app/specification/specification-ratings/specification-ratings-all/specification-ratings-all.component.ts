import { Component, OnInit } from '@angular/core';
import { Rating } from '@app/models/rating';
import { BrandService } from '@app/services/brand.service';
import { DataService } from '@app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-specification-ratings-all',
  templateUrl: './specification-ratings-all.component.html',
  styleUrls: ['./specification-ratings-all.component.scss']
})
export class SpecificationRatingsAllComponent implements OnInit {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  data: any;
  url: string;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getRating();

  }

  getRating(): void {
    this.url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;
    const linkOptions: string = `${this.url}/options.json`;

    this.dataService.getBrandRatings(linkOptions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((ratings: Rating[]) => {

        if (ratings) {
          debugger;
          this.data = {
            title: 'spec.rating.conditions.title',
            items: [
              { label: 'spec.rating.life-term.title', value: ratings[2].AgeMin },
              { label: 'spec.rating.min-deals-number.title', value: ratings[2].DealsMin },
              { label: 'spec.rating.min-yield.title', value: ratings[2].YieldMin },
              { label: 'spec.rating.min-yield.title', value: 'spec.rating.min-yield.value' }

            ]
          };
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
