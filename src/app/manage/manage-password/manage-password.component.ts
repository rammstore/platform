import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '@app/validators/password.validator';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.scss']
})
export class ManagePasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
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

    this.authService.changePassword(this.form.get('newPass').value).subscribe(() => {
      this.router.navigate(['/bill']);
    });
  }
}
