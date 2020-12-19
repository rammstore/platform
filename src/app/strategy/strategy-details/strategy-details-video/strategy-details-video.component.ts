import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import { DataService } from '@app/services/data.service';
import { StrategyService } from '@app/services/strategy.service';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-strategy-details-video',
  templateUrl: './strategy-details-video.component.html',
  styleUrls: ['./strategy-details-video.component.scss']
})
export class StrategyDetailsVideoComponent implements OnInit {

  strategy: Strategy;
  videolink: SafeResourceUrl;
  args: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private strategyService: StrategyService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getStrategy();
  }

  private getStrategy() {
    this.strategy = this.strategyService.strategy;

    if (this.strategy) {
      this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(this.strategy.getVideoLink);
    }
    else {
      this.args = {
        strategyId: this.route.parent.params['_value'].id,
      };

      this.getStrategyById(this.args)
        .pipe(take(1))
        .subscribe((strategy: Strategy) => {
          this.videolink = this.sanitizer.bypassSecurityTrustResourceUrl(strategy.getVideoLink);
        });
    }
  }

  private getStrategyById(args: any): Observable<Strategy> {
    return this.dataService.getStrategyById(args);
  }

}
