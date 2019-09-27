import { Component, OnInit } from '@angular/core';
import { Strategy } from '../../shared/models/strategy';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '../../shared/user/auth-data';
import { StorageService } from '../../shared/services/storage.service';
import { StrategyService } from '../../shared/services/strategy.service';

@Component({
  selector: 'app-strategy-fund',
  templateUrl: './strategy-fund.component.html',
  styleUrls: ['./strategy-fund.component.scss']
})
export class StrategyFundComponent implements OnInit {
  strategy: Strategy;
  form: FormGroup;
  authData: AuthData;

  constructor(
    public modalRef: BsModalRef,
    private storageService: StorageService,
    private strategyService: StrategyService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      this.authData = authData;
    });
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [
        (Math.round(this.authData.getWallets()[0].getEquity() / 10)),
        [Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity())]
      ]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.strategyService.fund(this.strategy.account.id, this.form.get('amount').value).subscribe(() => {
      this.strategy.account.equity = this.strategy.account.equity + this.form.get('amount').value;
      this.strategy.account.balance = this.strategy.account.balance + this.form.get('amount').value;
      this.authData.getWallets()[0].balance = this.authData.getWallets()[0].balance - this.form.get('amount').value;
      this.storageService.setAuthData(JSON.stringify(this.authData));
      this.modalRef.hide();
    });
  }
}
