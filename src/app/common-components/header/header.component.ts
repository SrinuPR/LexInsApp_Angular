import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public auth: AuthService,
    public route: Router,
    public commonService: CommonService
  ) { }

  logout() {
    this.auth.isLoggedIn = false;
    //this.commonService.userDtls = null;
    this.route.navigate(['']);
  }

  navigatetoHome() {
    this.auth.activeLink = '';
    this.route.navigate(['/dashboard']);
  }

}
