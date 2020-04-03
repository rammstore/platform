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
  footerLogoLink: string;

  constructor(
    private translateService: TranslateService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.brandService.getFooterLogoLink().subscribe((link: string) => {
      this.footerLogoLink = link;
    });

    this.language = this.translateService.currentLang;
  }
}
