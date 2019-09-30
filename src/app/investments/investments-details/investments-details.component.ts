import { Component, OnInit } from '@angular/core';
import { Account } from '@app/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-investments-details',
  templateUrl: './investments-details.component.html',
  styleUrls: ['./investments-details.component.scss']
})
export class InvestmentsDetailsComponent implements OnInit {
  investment: Account;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: object) => {
      this.investment = data['investment'];
      console.log(this.investment);
    });

  }

}
