import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '@app/validators/password.validator';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.scss']
})
export class ManagePasswordComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  isSuccessful: boolean;
  isDone: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      currentPass: ['', Validators.required],
      newPass: ['', Validators.required],
      confirmPass: ['', Validators.required]
    }, { validator: PasswordValidator('newPass', 'confirmPass') });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.authService.changePassword(this.form.get('currentPass').value, this.form.get('newPass').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isDone = true;
        this.isSuccessful = true;
        setTimeout(() => {
          this.router.navigate(['/account']);
        }, 1000);
      }, () => {
        this.isDone = true;
        this.isSuccessful = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
