import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { Observable } from 'rxjs/index';

@Component({
  selector: 'app-bill-results',
  templateUrl: './bill-results.component.html',
  styleUrls: ['./bill-results.component.scss']
})
export class BillResultsComponent implements OnInit {
  accountData: Observable<any>;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
     this.accountService.get().subscribe();
    // console.log(this.accountData);
  }

}
