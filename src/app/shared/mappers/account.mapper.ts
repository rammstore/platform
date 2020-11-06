import { iAccountsSearchOptions } from '@app/interfaces/account-search-options.interface';
import { Arguments } from '@app/interfaces/args.interface';

export class AccountMapper {
    static formatArgumentsToOptions(args: Arguments) {
        const Pagination = (args.paginator && {
            CurrentPage: args.paginator.currentPage,
            PerPage: args.paginator.perPage
        });

        const options: iAccountsSearchOptions = {
            Filter: {
                SearchMode: args.searchMode
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