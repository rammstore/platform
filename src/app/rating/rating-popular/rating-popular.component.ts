import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { tap } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { ArgumentsService } from '@app/services/arguments.service';

@Component({
  selector: 'app-rating-popular',
  templateUrl: './rating-popular.component.html',
  styleUrls: ['./rating-popular.component.scss']
})
export class RatingPopularComponent implements OnInit {
  strategies$: Observable<Strategy[]>;
  // component data
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  ratingPopular$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20 }),
      new TableColumn({ property: 'profit', label: 'common.table.label.yieldCommon', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24 }),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors', fontSize: 16 }),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({ property: 'strategy.investmentInfo', label: 'common.table.label.myInvestmentUSD', colored: true }),
      new TableColumn({ property: 'manage', label: 'common.table.label.manage' })
    ]),
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private argumentsService: ArgumentsService
  ) { }

  ngOnInit(): void {
    this.ratingPopular$ = this.argumentsService.ratingPopular$
      .pipe(
        tap((argument) => {
          this.args = {
            searchMode: argument.searchMode,
            dealsMin: argument.dealsMin,
            ageMin: argument.ageMin,
            yieldMin: argument.yieldMin,
            field: argument.field,
            direction: argument.direction,
            paginator: this.paginator
          };

          this.strategies$ = this.getStrategies();
        })
      );
  }

  getStrategies(): Observable<any> {
    this.args.searchText = this.searchText;
    return this.dataService.getBestRating(this.args);
  }

  getRating() {
    this.args.searchText = this.searchText;
    this.strategies$ = this.getStrategies();
  }

  search(){
    this.args.searchText = this.searchText;
    this.args.paginator.currentPage = 1;
    this.strategies$ = this.getStrategies();
  }
}
