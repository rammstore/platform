import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  links: ContentTabLink[] = [
    new ContentTabLink('Результаты', '/bill'),
    new ContentTabLink('Пополнить', '/bill/fund'),
    new ContentTabLink('Вывести', '/bill/withdraw'),
    new ContentTabLink('История переводов', '/bill/last-transfers')
  ];

  constructor() { }

  ngOnInit() {

  }

}
