import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models';

@Component({
  selector: 'app-investments-profile-change',
  templateUrl: './investments-profile-change.component.html',
  styleUrls: ['./investments-profile-change.component.scss']
})
export class InvestmentsProfileChangeComponent implements OnInit {

  strategy: Strategy;

  constructor(
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

}
