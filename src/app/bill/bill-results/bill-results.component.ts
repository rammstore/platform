import { Component, Input } from '@angular/core';
import { Wallet } from '@app/models';

@Component({
  selector: 'app-bill-results',
  templateUrl: './bill-results.component.html',
  styleUrls: ['./bill-results.component.scss']
})
export class BillResultsComponent {
  @Input() wallet: Wallet;
}
