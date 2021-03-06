import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  activeLink = '';

  constructor(public router: Router, public commonServcie: CommonService) { }

  showResetPassword() {
    return !(this.router.url === '/resetpassword');
  }

  isAuthenticated() {
    if (!(this.commonServcie.userDtls === undefined || this.commonServcie.userDtls === null) &&
      (this.commonServcie.userDtls.errorMessage === null || this.commonServcie.userDtls.errorMessage === '')) {
      return true;
    } else {
        return false;
    }
  }
}
