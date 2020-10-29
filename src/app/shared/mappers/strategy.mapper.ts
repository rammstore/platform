import { Arguments } from '@app/interfaces/args.interface';
import { iStrategiesSearchOptions } from '@app/interfaces/rating';

export class StrategyMapper {
    static formatArgumentsToOptions(args: Arguments){
        const Pagination = (args.paginator && {
            CurrentPage: args.paginator.currentPage,
            PerPage: args.paginator.perPage
          });

          const options: iStrategiesSearchOptions = {
              Filter: {
                SearchMode: args.searchMode,
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