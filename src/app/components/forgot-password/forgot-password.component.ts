import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.forgotPasswordForm = this.formBuilder.group({
      userID: new FormControl('', [Validators.required]),
      emailID: new FormControl('', [Validators.required]),
      confirmemailID: new FormControl('', [Validators.required, this.passwordConfirming])
    });
  }

  displayErrorMessages(field: string) {
    const control = this.forgotPasswordForm.get(field);
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
