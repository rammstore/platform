import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Rating } from '@app/models/rating';
import { LoaderService } from './loader.service';
import { CreateInstanceService } from './create-instance.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  logoLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  footerLogoLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  faviconLinkSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  ratingsSubject: BehaviorSubject<Rating[]> = new BehaviorSubject<Rating[]>(null);
  url: string;
  functionality: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private createInstanceService: CreateInstanceService,
    private notificationsService: NotificationsService

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
      this.functionality.next(result);
    });
  }

  getBrandRatings(): Observable<Rating[]> {
    this.loaderService.showLoader();

    this.url = `${window.location.origin}/config/${JSON.parse(localStorage.getItem('brand')).brand.brandKey}`;
    const linkOptions: string = `${this.url}/options.json`;

    this.http.get(linkOptions).subscribe((result: any) => {
      const ratings: Rating[] = [];

      result.Ratings.forEach((rating: any) => {
        ratings.push(this.createInstanceService.createRating(rating));
      });

      this.loaderService.hideLoader();
      this.ratingsSubject.next(ratings);
    }, (error: HttpErrorResponse) => {
      this.notificationsService.open('notify.loading.error', {
        type: 'error',
        autoClose: true,
        duration: 3000
      });
    });

    return this.ratingsSubject.asObservable();
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
