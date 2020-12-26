import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(@Inject(DOCUMENT) private _document: Document) {
  }

  get document(): Document {
    return this._document;
  }

  get isMobile() {
    return this._document.documentElement.clientWidth <= 1024;
  }
}
