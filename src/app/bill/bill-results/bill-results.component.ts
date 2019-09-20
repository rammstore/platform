import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';

@Component({
  selector: 'app-bill-results',
  templateUrl: './bill-results.component.html',
  styleUrls: ['./bill-results.component.scss']
})
export class BillResultsComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
     // this.accountService.get().subscribe();
    // console.log(this.accountData);
  }

}
