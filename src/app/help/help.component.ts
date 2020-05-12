import { Component, OnInit, SecurityContext, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  link: any;
  @ViewChild('frame', {static: true}) frame;
  scroll(id: string, group?) {
    if (group) {
      group.isOpen = true;
      setTimeout(() => {
        document.getElementById(id).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    } else {
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  constructor(
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.link = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}/${this.translateService.currentLang}.help.html`;
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
  }
}
