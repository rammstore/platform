import { Component, OnInit } from '@angular/core';
import { DataService } from "@app/services/data.service";
import { ActivatedRoute } from "@angular/router";
import { map, take, takeUntil, tap } from "rxjs/internal/operators";
import { Observable, of, Subject } from "rxjs";
import { Offer, Paginator, Strategy, TableColumn } from "@app/models";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap";
import { StrategyOfferCreateComponent } from "./strategy-offer-create/strategy-offer-create.component";
import { NotificationsService } from "@app/services/notifications.service";
import { TableHeaderRow } from "@app/models/table-header-row";
import { CustomDatePipe } from "@app/pipes/custom-date.pipe";
import { PercentPipe } from '@angular/common';
import { StrategyService } from '@app/services/strategy.service';

@Component({
  selector: 'app-strategy-offers',
  templateUrl: './strategy-offers.component.html',
  styleUrls: ['./strategy-offers.component.scss']
})
export class StrategyOffersComponent implements OnInit {
  destroy$ = new Subject();
  args: any;
  strategy: Strategy;
  strategy$: Observable<Strategy>;
  modalRef: BsModalRef;
  canCreateOffer: boolean = false;

  // component data
  privateOffers$: Observable<Offer[]>;
  offers$: Observable<any>;
  traderOffer$: Observable<Offer>;


  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'ID', label: 'ID' }),
      new TableColumn({
        property: 'DTCreated',
        label: 'common.table.label.dtCreate',
        pipe: { pipe: CustomDatePipe }
      }),
      new TableColumn({ property: 'link', label: 'common.table.label.link' }),
      new TableColumn({ property: 'commissionRate', label: 'common.table.label.commissionRate' }),
      new TableColumn({
        property: 'FeeRate',
        label: 'investment.details.strategy.feeRate',
        pipe: { pipe: PercentPipe }
      }),
      // new TableColumn({property: 'PartnerShareRate', label: 'common.table.label.partner'}),
      new TableColumn({ property: 'OfferStatus', label: 'common.table.label.status' }),
      new TableColumn({ property: 'IsPublic', label: 'common.table.label.offer.public' }),
      new TableColumn({ property: 'offerManage', label: 'common.table.label.manage' })
    ]),
  ];

  totalFields: string[] = ['account.equity', 'accounts', 'account.intervalPnL', 'feePaid', 'feeToPay'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    public dataService: DataService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private strategyService: StrategyService
  ) {
  }

  ngOnInit() {
    this.args = {
      strategyId: this.route.parent.params['_value'].id,
      paginator: this.paginator
    };

    this.strategy$ = ((!this.strategyService.strategy) ? this.getStrategyById(this.args) : of(this.strategyService.strategy))
      .pipe(
        tap((item) => this.strategy = item),
        tap((item) => this.getOffers())
      );
  }

  getOfferLink(link: string) {
    return `${location.origin}/strategies/link/${link}`;
  }

  getOffers(): void {
    this.offers$ = this.dataService.getOffers(this.strategy.id)
      .pipe(
        tap((offers: Offer[]) => {
          const publicOffer = offers.filter(item => item.type === 2)[0];
          
          const privateOffers = offers.filter(item => item.type === 1)

          this.canCreateOffer = !publicOffer && !privateOffers.length ? true : false;

          this.strategy.publicOffer = publicOffer;
          
          this.strategyService.strategy = this.strategy;

          this.strategy$ = of(this.strategy);

          this.privateOffers$ = of(privateOffers);

          this.traderOffer$ = of(offers.filter(item => item.type === 0)[0]);
        })

      );
  }

  onMakePublic(status: boolean, offer: any) {
    let observer;
    
    if (!status) {
      observer = this.dataService.setPublicOffer(this.strategy.id);
    }
    if (offer instanceof Offer) {
      observer = this.dataService.setPublicOffer(this.strategy.id, offer.id);
    }

    observer.subscribe(() => {
      this.notificationsService.open('notify.strategy.offer.change');

      this.getOffers();
    });
  }

  createOffer() {
    const options: ModalOptions = new ModalOptions();

    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyOfferCreateComponent, options);

    this.modalRef.content.onClose.subscribe(result => {
      if (result === true) {
        this.getStrategyById(this.args)
          .pipe(take(1))
          .subscribe((strategy: Strategy) => {
            this.strategyService.strategy = strategy;
            this.strategy = strategy;
          });

        this.getOffers();
      }
    });
  }

  private getStrategyById(args): Observable<Strategy> {
    return this.dataService.getStrategyById(args);
  }
}
