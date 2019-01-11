import { Component, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isButtonClicked = false;
  errorDesc = null;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public auth: AuthService,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async onSubmit() {
    this.isButtonClicked = true;
    if (this.loginForm.valid) {
      const user = this.loginForm.get('userName').value;
      const pwd = this.loginForm.get('password').value;
      await this.commonService.userLogin1(user, pwd);
      if (this.commonService.userDtls.errorMessage !== undefined &&
       (this.commonService.userDtls.errorMessage !== null)) {
        this.commonService.triggerAlerts({ message: this.commonService.userDtls.errorMessage, showAlert: true, isSuccess: false });
      } else if (null != this.commonService.userDtls && this.commonService.userDtls.status === 'Success') {
        console.log('inside login success block!');
        this.auth.isLoggedIn = true;
        if (this.commonService.userDtls.firstTimeLogin) {
          this.router.navigate(['/resetpassword']);
        } else {
          if (this.commonService.userDtls.isAdmin === 'Y') {
            this.commonService.adminJSON[0].isActive = true;
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.commonService.masterScreensDataList[0].isActive = true;
            this.router.navigate(['/dashboard']);
          }
        }
      }
    }
  }

  resetPassword() {
    this.router.navigate(['/resetpassword']);
  }

  forgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }

  displayErrorMessages(field: string) {
    const control = this.loginForm.get(field);
    if (control) {
      return control.invalid ? (this.isButtonClicked || (control.touched && control.invalid)) : false;
    }
    return false;
  }

}
