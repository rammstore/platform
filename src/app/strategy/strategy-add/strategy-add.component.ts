import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { AuthData } from '../../shared/user/auth-data';
import { StrategyService } from '../../shared/services/strategy.service';
import { Strategy } from '../../shared/models/strategy';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-strategy-add',
  templateUrl: './strategy-add.component.html',
  styleUrls: ['./strategy-add.component.scss']
})
export class StrategyAddComponent implements OnInit {
  currentStep: number = 1;
  formStep1: FormGroup;
  formStep2: FormGroup;
  authData: AuthData;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private strategyService: StrategyService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.buildFormStep1();
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      this.authData = authData;
    });
  }

  buildFormStep1(): void {
    this.formStep1 = this.fb.group({
      name: ['', Validators.required],
      fee: [25, [Validators.min(0), Validators.max(50)]],
      comission: [0, [Validators.min(0), Validators.max(100)]],
      isShared: [true]
    });
  }

  buildFormStep2(): void {
    this.formStep2 = this.fb.group({
      money: [(Math.round(this.authData.getWallets()[0].getEquity() / 10)), [Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity())]],
      target: [100, [Validators.min(0)]],
      protection: [0, [Validators.min(0), Validators.max(99)]]
    });
  }

  submitStep1(): void {
    this.formStep1.markAllAsTouched();

    if (!this.formStep1.valid) {
      return;
    }

    this.currentStep = 2;
    this.buildFormStep2();
  }

  submitStep2(): void {
    this.formStep2.markAllAsTouched();

    if (!this.formStep2.valid) {
      return;
    }

    const strategy: object = {
      Name: this.formStep1.get('name').value,
      FeeRate: this.formStep1.get('fee').value,
      CommissionRate: this.formStep1.get('comission').value,
      Shared: this.formStep1.get('isShared').value,
      Protection: this.formStep2.get('protection').value,
      Target: this.formStep2.get('target').value,
      Money: this.formStep2.get('money').value,
    };

    this.strategyService.add(strategy).subscribe(r => {
      console.log(r);
    });
  }

  back(): void {
    this.currentStep = 1;
  }
}
