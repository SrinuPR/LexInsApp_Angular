import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {
  @Input() isAdmin = false;
  adminJSON = [
    {id: '1', displayText: 'Create Admin', route: 'create-admin', icon: 'home'},
    {id: '2', displayText: 'Subscribers', route: 'subscribers', icon: 'home'},
    {id: '3', displayText: 'Create Subscriber', route: 'create-subscriber', icon: 'home'},
    {id: '4', displayText: 'User Type List', route: 'user-type-master', icon: 'home'},
    {id: '5', displayText: 'User Master', route: 'user-master', icon: 'home'}
  ];
  userJSON = [
    {id: '1', displayText: 'Customer P.O.', route: 'customer-po', icon: 'home'},
    {id: '2', displayText: 'Inspection Type', route: 'inspection-type', icon: 'home'},
    {id: '3', displayText: 'Inspection Stage', route: 'inspection-stage', icon: 'home'},
    {id: '4', displayText: 'Facilities', route: 'facilities', icon: 'home'},
    {id: '5', displayText: 'Shift', route: 'shift', icon: 'home'},
    {id: '6', displayText: 'Component Master', route: 'component-master', icon: 'home'},
    {id: '7', displayText: 'Work Job Order', route: 'work-job-order', icon: 'home'},
    {id: '8', displayText: 'Inspection Master', route: 'inspections', icon: 'home'},
    {id: '9', displayText: 'Inspection-line-item', route: 'inspection-line-item', icon: 'home'},
    {id: '10', displayText: 'Inspection Measurements', route: 'inspection-meaurements', icon: 'home'},
    {id: '11', displayText: 'Inspection-Report', route: 'inspection-report', icon: 'home'}
  ];
  leftNavJSON: Array<any> = [];
  constructor(
    public auth: AuthService,
    public route: Router
  ) { }

  ngOnInit() {
    this.leftNavJSON = this.isAdmin ? this.adminJSON : this.userJSON;
  }

  showContainer() {
    return (this.route.url === '/dashboard' && this.auth.activeLink === '');
  }

  navigate(url) {
    const path = this.isAdmin ? '/admin-dashboard/' : '/dashboard/';
    this.route.navigate([path + url]);
  }

}
