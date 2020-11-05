import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Account } from '@app/models';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';

@Component({
  selector: 'app-manage-account-change-profile',
  templateUrl: './manage-account-change-profile.component.html',
  styleUrls: ['./manage-account-change-profile.component.scss']
})
export class ManageAccountChangeProfileComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  account: Account;
  @Input() methodName: string;
  @Input() methodArgs: any;
  functionality: object;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public modalRef: BsModalRef,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [this.account.equity],
      factor: [{value: this.account.factor, disabled: this.account.isSecured() && this.account.isMy()}, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [Math.round(this.account.target * 100), [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [Math.round(this.account.protection * 100), [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  changeProfile(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    if (!this.form.get('factor').value) {
      this.form.get('factor').setErrors({incorrect: true});
      return;
    }

    const values = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    const newObj = {
      protection: undefined,
      target: undefined,
      factor: undefined
    };

    if (values.protection !== this.account.protection) {
      newObj.protection = values.protection;
    }
    if (values.target !== this.account.target) {
      newObj.target = values.target;
    }
    if (values.factor !== this.account.factor) {
      newObj.factor = values.factor;
    }

    this.dataService.changeAccountProfile(this.account.id, newObj, this.methodName, this.methodArgs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
