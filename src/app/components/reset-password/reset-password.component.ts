import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDetailsModel } from '../../models/user.model';
import { CommonService } from '../../services/common.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorDesc;
  passwordMismatch = false;
  resetPasswordGiven = false;
  constructor(
    public auth: AuthService,
    public router: Router,
    public formBuilder: FormBuilder,
    public userDtls: UserDetailsModel,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.resetPasswordForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, this.passwordConfirming.bind(this)]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordConfirming.bind(this)])
    });
  }

  checkPasswordStrength() {
    this.resetPasswordGiven = true;
    const control = this.resetPasswordForm.get('newPassword');
    if (control.value && (control.value.length >= 8  && control.value.length <= 20 ) ) {
      control.setErrors(null);
    }
    else {
      control.setErrors({ 'weakPassword': true});
    }
  }

  displayErrorMessages(field: string) {
    const control = this.resetPasswordForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }

  passwordConfirming(control: AbstractControl): { invalid: boolean } {
    if (this.resetPasswordForm != null) {
      const newPwd: string = this.resetPasswordForm.get('newPassword').value;
      const confrimPwd: string = this.resetPasswordForm.get('confirmPassword').value;
      if (newPwd === '' && (confrimPwd !== null && confrimPwd !== '') ) {
        this.passwordMismatch = true;
        return { invalid: false };
      }
      if (confrimPwd !== '' && newPwd !== '' && newPwd !== confrimPwd) {
        this.passwordMismatch = true;
      }
      if (confrimPwd !== '' && newPwd !== '' && newPwd === confrimPwd) {
        this.passwordMismatch = false;
      }
    }
    /* if (control.get('newPassword') && control.get('confirmPassword')) {
      if (control.get('newPassword').value !== control.get('confirmPassword').value) {
        return { invalid: true };
      }
    } */
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      const user = this.resetPasswordForm.get('userName').value;
      const pwd = this.resetPasswordForm.get('password').value;
      const newPwd = this.resetPasswordForm.get('newPassword').value;
      const confNewPwd = this.resetPasswordForm.get('confirmPassword').value;
      const response =  await this.commonService.resetPassword(user, pwd, newPwd, confNewPwd);
      console.log('is Logged In:' + this.auth.isLoggedIn);
      if (null != response && response.text === 'Passowrd Changed Successfully') {
        this.commonService.triggerAlerts({message: 'Password changed successfully', showAlert: true, isSuccess: true});
        this.router.navigate(['']);
      }
      else {
        this.commonService.triggerAlerts(
          {message: response , showAlert: true, isSuccess: false
        });
    }
  }
  }
}
