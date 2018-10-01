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

  onSubmit() {
    this.isButtonClicked = true;
    if (this.loginForm.valid) {
      this.commonService.userLogin();
      this.auth.isLoggedIn = true;
      this.router.navigate(['/dashboard']);
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
