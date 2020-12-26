import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { Router } from '@angular/router';
import { BrandService } from '@app/services/brand.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StrategyOfferCreateComponent } from "./strategy-details/strategy-offers/strategy-offer-create/strategy-offer-create.component";
import { StrategyService } from "@app/services/strategy.service";
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  links: ContentTabLink[] = [
    new ContentTabLink('myStrategies.active.title', '/strategies'),
    new ContentTabLink('myStrategies.closed.title', '/strategies/closed')
  ];
  modalRef: BsModalRef;
  methodArgs: any;
  functionality: object;
  key: string;
  updateStatus: string;

  constructor(
    private modalService: BsModalService,
    private brandService: BrandService,
    private strategyService: StrategyService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.strategyPage$.subscribe(
      item => this.key = item
    );
        
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });
  }

  onRouterOutletActivate(component: any) {
    this.methodArgs = { paginator: component.paginator };
  }

  openAddStrategyDialog() {
    this.updateStatus = "strategy-created";
    const options: ModalOptions = new ModalOptions();

    options.initialState = {
      updateStatus: this.updateStatus,
      key: this.key
    };

    this.modalRef = this.modalService.show(StrategyAddComponent, options);

    this.modalRef.content.onClose.subscribe(result => {
      this.strategyService.update = true;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
