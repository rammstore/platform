import {Component, OnInit} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntil} from "rxjs/internal/operators";
import {Subject} from "rxjs";
import {Offer, Paginator, Strategy, TableColumn} from "@app/models";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap";
import {StrategyOfferCreateComponent} from "./strategy-offer-create/strategy-offer-create.component";
import {NotificationsService} from "@app/services/notifications.service";
import {TableHeaderRow} from "@app/models/table-header-row";
import {CustomCurrencyPipe} from "@app/pipes/custom-currency.pipe";
import {PercentPipe} from "@angular/common";
import {CustomDatePipe} from "@app/pipes/custom-date.pipe";

@Component({
  selector: 'app-strategy-offers',
  templateUrl: './strategy-offers.component.html',
  styleUrls: ['./strategy-offers.component.scss']
})
export class StrategyOffersComponent implements OnInit {
  destroy$ = new Subject();
  args: any;
  strategy: Strategy;
  modalRef: BsModalRef;


  // component data
  offers: Offer[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({property: 'commissionRate', label: 'common.table.label.commissionRate'}),
      new TableColumn({property: 'DTCreated', label: 'common.table.label.dtCreate', pipe: {pipe: CustomDatePipe}}),
      new TableColumn({property: 'FeeRate', label: 'investment.details.strategy.feeRate'}),
      new TableColumn({property: 'ID', label: 'ID'}),
      new TableColumn({property: 'IsPublic', label: 'common.table.label.offer.public'}),
      new TableColumn({property: 'link', label: 'common.table.label.link'}),
      // new TableColumn({property: 'PartnerShareRate', label: 'common.table.label.partner'}),
      new TableColumn({property: 'OfferStatus', label: 'common.table.label.status'})
    ]),
  ];

  totalFields: string[] = ['account.equity', 'accountsCount', 'account.intervalPnL', 'feePaid', 'feeToPay'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    public dataService: DataService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.args = {
      strategyId: this.route.parent.params['_value'].id,
      paginator: this.paginator
    };

    this.dataService.getStrategy(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategy: Strategy) => {
        this.strategy = strategy;
      });

    this.getOffers();
  }

  getOffers(): void {
    this.dataService.getOffers(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((offers) => {
        this.offers = offers;
      });
  }

  makeNotPublic() {
    this.dataService.setPublicOffer(this.strategy.id).subscribe((item) => {
      this.strategy.publicOffer = null;
      this.notificationsService.open('notify.strategy.offer.create');
    });
  }

  get link() {
    return ``;
  }

  createOffer() {
    const options: ModalOptions = new ModalOptions();

    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyOfferCreateComponent, options);
  }
}
