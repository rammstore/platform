import { Component, OnInit } from '@angular/core';
import { Rating } from '@app/models/rating';
import { DataService } from '@app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-specification-ratings-popular',
  templateUrl: './specification-ratings-popular.component.html',
  styleUrls: ['./specification-ratings-popular.component.scss']
})
export class SpecificationRatingsPopularComponent implements OnInit {
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
          const yieldMin = (ratings[1].YieldMin * 100) + '%';
          this.data = {
            title: 'spec.rating.conditions.title',
            items: [
              { label: 'spec.rating.life-term.title', value: ratings[1].AgeMin },
              { label: 'spec.rating.min-deals-number.title', value: ratings[1].DealsMin },
              { label: 'spec.rating.min-yield.title', value: yieldMin },
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
