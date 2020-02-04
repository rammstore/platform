import { Component } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent {
  links: ContentTabLink[] = [
    new ContentTabLink('Активные', '/strategies'),
    new ContentTabLink('Закрытые', '/strategies/closed')
  ];
  modalRef: BsModalRef;
  methodArgs: any;

  constructor(
    private modalService: BsModalService,
    private router: Router
  ) { }

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
}
