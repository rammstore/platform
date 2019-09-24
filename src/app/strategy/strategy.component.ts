import { Component, TemplateRef } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { StrategyAddComponent } from './strategy-add/strategy-add.component';

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

  constructor(
    private modalService: BsModalService
  ) { }

  openAddStrategyDialog() {
    this.modalRef = this.modalService.show(StrategyAddComponent);
  }
}
