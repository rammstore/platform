import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@app/services/storage.service';
import { AuthData } from '@app/user/auth-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService
  ) {
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      translateService.setDefaultLang(authData.client.language);
      translateService.use(authData.client.language);
    });
  }
}
