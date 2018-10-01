import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    public route: Router
  ) { }

  showContainer() {
    return (this.route.url === '/dashboard' && this.auth.activeLink === '');
  }

  navigate(url) {
    this.route.navigate(['/dashboard/' + url]);
    // this.auth.activeLink = url;
  }

}
