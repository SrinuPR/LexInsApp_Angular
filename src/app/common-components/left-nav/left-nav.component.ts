import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {
  @Input() isAdmin = false;
  leftNavJSON: Array<any> = [];
  userName: string;
  constructor(
    public auth: AuthService,
    public route: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (this.isAdmin) {
      this.leftNavJSON = this.commonService.adminJSON;
    } else {
      this.leftNavJSON = [];
      const menuJSON = this.commonService.masterScreensDataList;
      _.forEach(this.commonService.masterScreensDataList, (item) => {
        if (this.commonService.userDtls.screenList.indexOf(item.id) > -1) {
          this.leftNavJSON.push(item);
        }
      });
    }
    this.userName = this.commonService.userDtls.userName || '';
  }

  showContainer() {
    return (this.route.url === '/dashboard' && this.auth.activeLink === '');
  }

  navigate(url) {
    const isAdminCheck = (this.commonService.userDtls.isAdmin === 'Y');
    if (url === 'home' && isAdminCheck) {
      this.route.navigate(['/admin-dashboard']);
    } else {
      this.setActiveLink(url);
      this.route.navigate([(this.isAdmin ? '/admin-dashboard/' : '/dashboard/') + url]);
    }
  }

  setActiveLink(activeRoute) {
    this.leftNavJSON.forEach((item) => {
      item.isActive = (activeRoute === item.route);
    });
  }

}
