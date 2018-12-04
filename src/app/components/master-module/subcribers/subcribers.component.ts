import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { CommonService } from 'src/app/services/common.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subcribers.component.html',
  styleUrls: ['./subcribers.component.scss']
})

export class SubscribersComponent implements OnInit {
  constructor(
    public router: Router,
    public commonService: CommonService,
    public subscriberService: SubscriberService,
    private sessionService: SessionService
  ) { }
  ngOnInit() {
    this.subscriberService.getAllSubscribers();
  }

  viewSubscriber(item) {
    this.commonService.userDtls = this.sessionService.getSession();
    this.commonService.userDtls.subscriberId = item.subscriberId;
    this.commonService.userDtls.subscriberName = item.subscriberName;
    this.sessionService.setSession(this.commonService.userDtls);
    this.router.navigate(['dashboard']);
  }
}
