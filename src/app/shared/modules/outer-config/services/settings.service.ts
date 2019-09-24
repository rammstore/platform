import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Configuration} from '../models/config';
import {map} from 'rxjs/operators';

@Injectable()
export class SettingsService {
    private config = '../../../assets/config.json';

    promise: Promise<any>;
    private status = false;

    constructor(private http: HttpClient) {
    }

    load() {
      // @ts-ignore
      this.promise = this.http.get(this.config, {
        params: null
      })
        .pipe(
          map((data: any) => {
          this.reWriteConfig(data);
        }))
        .toPromise()
    }

    isStatusLoad() {
        return this.status;
    }

    reWriteConfig(data: any) {
        Configuration.reWrite(data);
        this.status = true;
    }
}
