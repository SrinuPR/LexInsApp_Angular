import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { CommonService } from './services/common.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lexlnsoft';
  constructor(
    private route: Router,
    private sessionService: SessionService,
    private commonService: CommonService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('userDetails')) {
      const userDetails = sessionStorage.getItem('userDetails');
      this.sessionService.setSession(JSON.parse(userDetails));
      this.commonService.userDtls = this.sessionService.getSession();
      this.auth.isLoggedIn = true;
    } else {
      this.route.navigate(['']);
    }
  }
}
