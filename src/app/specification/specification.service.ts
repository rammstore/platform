import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@assets/config';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(`${CONFIG.baseApiUrl}/platform.getSpecification`);
  }
}
