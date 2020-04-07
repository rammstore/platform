import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs/index';
import { CONFIG } from '@assets/config';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url === `${CONFIG.baseApiUrl}/session.login` || request.url.startsWith('/assets/i18n')) {
      return next.handle(request);
    }

    const options: { url?: string, params?: any, observe?: 'response', headers?: HttpHeaders, setHeaders?: any } = {};

    options.headers = new HttpHeaders({Token: this.authService.getToken(), AppToken: CONFIG.appToken});
    request = request.clone(options);

    return next.handle(request);
  }
}
