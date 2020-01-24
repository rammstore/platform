import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  logoLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  faviconLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient
  ) {
  }

  getBrandFile() {
    const link: string = JSON.parse(localStorage.getItem('brand')).brand;
    this.http.get(link).subscribe((result: any) => {
      this.setLogoLink(result['logo']);
      this.setFavicon(result['favicon']);
      this.setTitle(result['title']);
    });
  }

  setLogoLink(link: string): void {
    this.logoLinkSubject.next(link);
  }

  setFavicon(iconLink: string): void {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link['type'] = 'image/x-icon';
    link['rel'] = 'shortcut icon';
    link['href'] = iconLink;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  setTitle(title: string): void {
    document.title = title;
  }

  getLogoLink(): Observable<string> {
    return this.logoLinkSubject.asObservable();
  }
}
