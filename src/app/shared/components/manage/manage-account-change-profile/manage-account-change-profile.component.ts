import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Account } from '@app/models';
import { DataService } from '@app/services/data.service';

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

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      factor: [{value: this.account.factor, disabled: this.account.isSecured() && this.account.isMy()}, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [this.account.target * 100, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [this.account.protection * 100, [Validators.required, Validators.min(0), Validators.max(99.999), Validators.pattern('^[0-9]*')]]
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

    this.dataService.changeAccountProfile(this.account.id, newObj, this.account.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
