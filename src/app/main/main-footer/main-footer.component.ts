import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  language: string;

  constructor(
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.language = this.translateService.currentLang;
  }
}
