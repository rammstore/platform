import { Component, Input } from '@angular/core';
import { Wallet } from '@app/models';

@Component({
  selector: 'app-account-results',
  templateUrl: './account-results.component.html',
  styleUrls: ['./account-results.component.scss']
})
export class AccountResultsComponent {
  @Input() wallet: Wallet;
}
