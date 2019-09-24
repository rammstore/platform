import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function loadConfig(app: SettingsService) {
  return () => {
    return new Promise((resolve) => {
      app.load();
      setTimeout(() => {
        if (app.isStatusLoad()) {
          resolve();
        }
      }, 500);
    });
  };
}


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [
        SettingsService
      ],
      multi: true
    },
  ],
})
export class OuterConfigModule { }
