import { Component, OnInit } from '@angular/core';
import { Rating } from '@app/models/rating';
import { DataService } from '@app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-specification-ratings-rated',
  templateUrl: './specification-ratings-rated.component.html',
  styleUrls: ['./specification-ratings-rated.component.scss']
})
export class SpecificationRatingsRatedComponent implements OnInit {
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
    this.dataService.getBrandRatings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ratings: any[]) => {
        if (ratings && ratings.length) {
          this.data = {
            title: 'spec.rating.conditions.title',
            items: [
              { label: 'spec.rating.life-term.title', value: ratings[0].Filter.AgeMin },
              { label: 'spec.rating.min-deals-number.title', value: ratings[0].Filter.DealsMin }
            ]
          };

          if(ratings[0].Filter.YieldMin){
            this.data.items.push({ label: 'spec.rating.min-yield.title', value: ratings[0].Filter.YieldMin * 100 });
          }

          this.data.items.push({ label: 'spec.rating.orderBy.field', value: 'spec.rating.orderBy.field.' + ratings[0].OrderBy.Field });
          this.data.items.push({ label: 'spec.rating.orderBy.directions', value: 'spec.rating.orderBy.directions.value' });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
