import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  activeLink = '';
  
  constructor(public router: Router) { }

  showResetPassword() {
    return !(this.router.url === '/resetpassword');
  }
}
