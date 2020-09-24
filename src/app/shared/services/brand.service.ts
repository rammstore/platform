import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  logoLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  footerLogoLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  faviconLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  url: string;
  functionality: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor(
    private http: HttpClient
  ) {
  }

  getBrandFile() {
    this.url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;
    this.setLogoLink(JSON.parse(localStorage.getItem('brand')).brand.logo);
    this.setfooterLogoLink(JSON.parse(localStorage.getItem('brand')).brand.footerLogo);
    this.setFavicon(JSON.parse(localStorage.getItem('brand')).brand.favicon);

    const link: string = `${this.url}/contacts.json`;
    this.http.get(link).subscribe((result: any) => {
      this.setTitle(result['CompanyName']);
    });
    const linkOptions: string = `${this.url}/options.json`;
    this.http.get(linkOptions).subscribe((result: any) => {
      console.log('options.json', linkOptions);
      console.log(result);
      this.functionality.next(result);
    });
  }

  setLogoLink(link: string): void {
    this.logoLinkSubject.next(link);
  }

  setfooterLogoLink(link: string): void {
    this.footerLogoLinkSubject.next(link);
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

  getFooterLogoLink(): Observable<string> {
    return this.footerLogoLinkSubject.asObservable();
  }
}
