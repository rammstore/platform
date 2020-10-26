import { Component, OnInit, OnDestroy, } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { Argument } from '@app/models/argument';
import { ArgumentsService } from '@app/services/arguments.service';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { DataService } from '@app/services/data.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  // destroy$ = new Subject();
  optionsRatings$: Observable<any>;
  args$: Observable<Argument>;

  links: ContentTabLink[] = [
    new ContentTabLink('rating.rating.title', '/rating'),
    new ContentTabLink('rating.popular.title', '/rating/popular'),
    new ContentTabLink('rating.all.title', '/rating/all')
  ];

  constructor(
    private dataService: DataService,
    private argumentsService: ArgumentsService,
    private createInstanceService: CreateInstanceService

  ) {
  }

  ngOnInit(){
    this.optionsRatings$ = this.dataService.getOptionsRatings()
    .pipe(
      map(({ Ratings }) => Ratings),
      map(ratings => {
        if (ratings) {
          const rated = ratings.filter(item => item.Name === 'Rating')[0];
          const popular = ratings.filter(item => item.Name === 'Popular')[0];
          const all = ratings.filter(item => item.Name === 'All')[0];
          
          this.argumentsService.retingRated = this.createInstanceService.createArgument(rated);
          this.argumentsService.retingPopular = this.createInstanceService.createArgument(popular);
          this.argumentsService.retingAll = this.createInstanceService.createArgument(all);

          return ratings;
        }
      }),
    );
  }

  // ngOnDestroy(): void {
  //   this.destroy$.next(true);
  // }
}
