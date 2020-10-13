import {iStrategiesSearchOptions} from '@app/interfaces/rating';
import {Arguments} from '@app/interfaces/args.interface';

export class RatingMapper {
  static formatArgumentsToOptions(args: Arguments) {

    const Pagination = (args.paginator  && {
      CurrentPage: args.paginator.currentPage,
      PerPage: args.paginator.perPage
    });

    const options: iStrategiesSearchOptions = {
      Filter: {
        SearchMode: args.searchMode,
        AgeMin: args.ageMin,
        YieldMin: args.yieldMin,
        DealsMin: args.dealsMin,
        ...(args.searchText && {Name: args.searchText })
      },
      OrderBy: {
        Field: args.field,
        Direction: args.direction
      },
      Pagination
    };

    return options;
  }
}
