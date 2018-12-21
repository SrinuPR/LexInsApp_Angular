import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public auth: AuthService,
    public route: Router,
    public commonService: CommonService,
    private sessionService: SessionService
  ) { }

  logout() {
    this.auth.isLoggedIn = false;
    this.sessionService.clearSession();
    this.route.navigate(['']);
  }

  navigatetoHome() {
    this.auth.activeLink = '';
    console.log(this.route.url);
    if (this.route.url === '/dashboard') {
      this.commonService.userDtls = this.sessionService.getSession();
      this.commonService.userDtls.subscriberId = null;
      this.commonService.userDtls.subscriberName = null;
      this.sessionService.setSession(this.commonService.userDtls);
      this.route.navigate(['/admin-dashboard/subscribers']);
    } else {
      this.route.navigate(['/dashboard']);
    }
  }

}
