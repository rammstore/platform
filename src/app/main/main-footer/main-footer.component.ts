import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BrandService } from '@app/services/brand.service';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  language: string;
  logoLink: string;

  constructor(
    private translateService: TranslateService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.brandService.getLogoLink().subscribe((link: string) => {
      this.logoLink = link;
    });

    this.language = this.translateService.currentLang;
  }
}
