import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent {

  constructor(
    public auth: AuthService,
    public route: Router
  ) { }

  showContainer() {
    return (this.route.url === '/dashboard' && this.auth.activeLink === '');
  }

  navigate(url) {
    this.route.navigate(['/dashboard/' + url]);
  }

}
