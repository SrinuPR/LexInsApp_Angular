import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.resetPasswordForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordConfirming])
    });
  }

  displayErrorMessages(field: string) {
    const control = this.resetPasswordForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }

  passwordConfirming(control: AbstractControl): { invalid: boolean } {
    if (control.get('password') && control.get('confirmPassword')) {
      if (control.get('password').value !== control.get('confirmPassword').value) {
        return { invalid: true };
      }
    }
  }
}
