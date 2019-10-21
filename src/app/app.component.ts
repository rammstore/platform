import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { LoaderService } from '@app/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
  isLoading: Observable<boolean>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService
  ) {}

  ngAfterViewChecked(): void {
    this.isLoading = this.loaderService.isLoading();
    this.cdRef.detectChanges();
  }
}
