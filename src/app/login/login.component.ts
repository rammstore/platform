import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../shared/guards/login.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    this.authService.login(this.form.getRawValue().login, this.form.getRawValue().password).subscribe(() => {
      this.router.navigate(['/bill']);
    });
  }
}
