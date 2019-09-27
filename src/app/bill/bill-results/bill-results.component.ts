import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';
import { Wallet } from '@app/user';

@Component({
  selector: 'app-bill-results',
  templateUrl: './bill-results.component.html',
  styleUrls: ['./bill-results.component.scss']
})
export class BillResultsComponent implements OnInit {
  @Input() wallet: Wallet;

  constructor(
  ) { }

  ngOnInit() {
  }

}
