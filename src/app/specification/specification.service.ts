import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@assets/config';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {
  apiUrl: string = CONFIG.baseApiUrl;

  constructor(private http: HttpClient) {
    if (!CONFIG.baseApiUrl.startsWith('http')) {
      this.apiUrl = `${window.location.origin}${CONFIG.baseApiUrl}`;
    }
  }

  get() {
    return this.http.get(`${this.apiUrl}/platform.getSpecification`);
  }
}
