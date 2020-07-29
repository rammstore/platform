import {Component, OnInit} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntil} from "rxjs/internal/operators";
import {Subject} from "rxjs";
import {Strategy} from "@app/models";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap";
import {StrategyOfferCreateComponent} from "./strategy-offer-create/strategy-offer-create.component";
import {NotificationsService} from "@app/services/notifications.service";

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

  constructor(
    public dataService: DataService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.args = {
      strategyId: this.route.parent.params['_value'].id
    };

    this.dataService.getStrategy(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategy: Strategy) => {
        this.strategy = strategy;
        console.log('strategy', strategy);
      });

    this.dataService.getOffers(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        debugger
      })
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
