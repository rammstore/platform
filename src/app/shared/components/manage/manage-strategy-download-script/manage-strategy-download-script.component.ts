import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Strategy } from '@app/models';
import { BsModalRef } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DataService } from '@app/services/data.service';
import { CONFIG } from '@assets/config';

@Component({
  selector: 'app-manage-strategy-download-script',
  templateUrl: './manage-strategy-download-script.component.html',
  styleUrls: ['./manage-strategy-download-script.component.scss']
})
export class ManageStrategyDownloadScriptComponent implements OnInit {
  // component data
  strategy: Strategy;
  token: string;
  form: FormGroup;
  apiUrl: string = CONFIG.baseApiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService,
    public modalRef: BsModalRef
  ) {
    if (!CONFIG.baseApiUrl.startsWith('http')) {
      this.apiUrl = `${window.location.origin}${CONFIG.baseApiUrl}`;
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.dataService.getStrategyToken(this.strategy.id).subscribe((token: string) => {
      this.token = token;
    });
    this.form = this.fb.group({
      platform: ['mq4']
    });
  }

  download() {
    const urlProtocol = CONFIG.baseApiUrl.split('://')[0] + '://';
    const urlHost = CONFIG.baseApiUrl.split('://')[1].split('/api/')[0];
    this.http.get(`assets/adviser/sample.${this.form.get('platform').value}`, {responseType: 'text'})
      .subscribe((fileContent: string) => {
        let newContent: string = fileContent.replace(/<strategy_name>/g, this.strategy.name);
        newContent = newContent.replace(/<strategy_token>/g, this.token);
        newContent = newContent.replace(/<api_protocol>/g, urlProtocol);
        newContent = newContent.replace(/<api_host>/g, urlHost);

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';

        const blob = new Blob([newContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = `RAMM_Signal_${this.strategy.id}.${this.form.get('platform').value}`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.modalRef.hide();
      });
  }
}
