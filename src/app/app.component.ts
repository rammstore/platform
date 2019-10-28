import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '@app/services/loader.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, OnInit {
  isLoading: Observable<boolean>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (window.localStorage.getItem('language')) {
      this.translateService.setDefaultLang(window.localStorage.getItem('language'));
      this.translateService.use(window.localStorage.getItem('language'));
    }
  }

  ngAfterViewChecked(): void {
    this.isLoading = this.loaderService.isLoading();
    this.cdRef.detectChanges();
  }
}
