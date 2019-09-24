import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.scss']
})
export class DialogWrapperComponent implements OnInit {
  @Input() title: string;
  @Input() modalRef: BsModalRef;

  constructor() { }

  ngOnInit() {
  }

}
