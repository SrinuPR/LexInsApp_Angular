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
    if (this.commonServcie.userDtls != null) {
      return true;
    } else {
        return false;
    }
  }
}
