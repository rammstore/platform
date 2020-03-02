import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function PasswordValidator(newPassControlName: string, confirmPassControlName: string): ValidatorFn {
  return (group: FormGroup) => {
    const passwordControl: AbstractControl = group.get(newPassControlName);
    const confirmControl: AbstractControl = group.get(confirmPassControlName);

    if (confirmControl.errors && !confirmControl.hasError('passwordMismatch')) {
      // return if another validator has already found an error on the confirmControl
      return this;
    }

    if (passwordControl.value !== confirmControl.value) {
      confirmControl.setErrors({ passwordMismatch: true });
    } else {
      confirmControl.setErrors(null);
    }

  };
}
