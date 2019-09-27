import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';

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
  authData: AuthData;

  constructor(
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      this.authData = authData;
    });
  }

}
