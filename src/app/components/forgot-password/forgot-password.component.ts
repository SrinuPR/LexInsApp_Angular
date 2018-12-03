import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorDesc;
  emailMismatch = false;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.forgotPasswordForm = this.formBuilder.group({
      userID: new FormControl('', [Validators.required]),
      emailID: new FormControl('', [Validators.required, this.passwordConfirming.bind(this)]),
      confirmemailID: new FormControl('', [Validators.required, this.passwordConfirming.bind(this)])
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

    if (this.forgotPasswordForm != null) {
      const email: string = this.forgotPasswordForm.get('emailID').value;
      const confrimEmail: string = this.forgotPasswordForm.get('confirmemailID').value;
      if (email === '' && (confrimEmail !== null && confrimEmail !== '') ) {
        console.log('block 1');
        this.emailMismatch = true;
        return { invalid: false };
      }
      if (confrimEmail !== '' && email !== '' && email !== confrimEmail) {
        console.log('block 2');
        this.emailMismatch = true;
      }
      if (confrimEmail !== '' && email !== '' && email === confrimEmail) {
        console.log('block 3');
        this.emailMismatch = false;
      }
    }
    /* if (control.get('emailID') && control.get('confirmemailID')) {
      if (control.get('emailID').value !== control.get('confirmemailID').value) {
        return { invalid: true };
      }
    } */
  }
  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const user = this.forgotPasswordForm.get('userID').value;
      const emailId = this.forgotPasswordForm.get('emailID').value;
      await this.commonService.forgotPassword(user, emailId);
      const userDtls = this.commonService.userDtls;
      this.errorDesc = userDtls.errorMessage;
      this.commonService.triggerAlerts(
        {message: 'Password was sent successfully to the registred email Kindly check your email!', showAlert: true, isSuccess: true
      });
    }
  }

}
