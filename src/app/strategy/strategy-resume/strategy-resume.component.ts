import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '../../shared/user/auth-data';
import { StorageService } from '../../shared/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '../../shared/models/strategy';
import { StrategyService } from '../../shared/services/strategy.service';
import { StrategyResumeOptions } from '@app/models';

@Component({
  selector: 'app-strategy-resume',
  templateUrl: './strategy-resume.component.html',
  styleUrls: ['./strategy-resume.component.scss']
})
export class StrategyResumeComponent implements OnInit {
  form: FormGroup;
  authData: AuthData;
  strategy: Strategy;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private strategyService: StrategyService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      this.authData = authData;
    });
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0), Validators.max(this.authData.getWallets()[0].getAvailable())]],
      goal: [100, [Validators.required, Validators.min(0)]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99)]]
    });
  }

  resume(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.strategyService.resume(this.strategy.id).subscribe(() => {
      this.strategy.resume();
      this.modalRef.hide();
    });
  }
}
