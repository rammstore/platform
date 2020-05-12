import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { Router } from '@angular/router';
import { BrandService } from '@app/services/brand.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  constructor(
    private modalService: BsModalService,
    private brandService: BrandService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      methodName: 'getActiveMyStrategies',
      methodArgs: this.methodArgs
    };
    this.modalRef = this.modalService.show(StrategyAddComponent, options);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
