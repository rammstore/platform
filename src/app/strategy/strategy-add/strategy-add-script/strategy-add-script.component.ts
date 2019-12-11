import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ManageStrategyDownloadScriptComponent } from '@app/components/manage/manage-strategy-download-script/manage-strategy-download-script.component';

@Component({
  selector: 'app-strategy-add-script',
  templateUrl: './strategy-add-script.component.html',
  styleUrls: ['./strategy-add-script.component.scss']
})
export class StrategyAddScriptComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  openDownloadScriptDialog(): void {
    const options: ModalOptions = new ModalOptions();

    options.initialState = {
     strategy: this.modalRef.content.strategy
    };

    this.modalService.show(ManageStrategyDownloadScriptComponent, options);
    this.close();
  }

  close(): void {
    this.modalRef.hide();
  }
}
