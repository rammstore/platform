import { Component, TemplateRef } from '@angular/core';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

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

  openAddStrategyDialog(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
