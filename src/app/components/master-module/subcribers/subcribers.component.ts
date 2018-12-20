import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { CommonService } from 'src/app/services/common.service';
import { SessionService } from 'src/app/services/session.service';
import { MatDialog } from '@angular/material';
import { UsersListDialogComponent } from './users-list-dialog.component';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subcribers.component.html',
  styleUrls: ['./subcribers.component.scss']
})

export class SubscribersComponent implements OnInit {
  currentPage = 0;
  pageSize = 10;
  pagedResults: Array<any> = [];
  subscribersList: Array<any> = [];
  constructor(
    public router: Router,
    public commonService: CommonService,
    public subscriberService: SubscriberService,
    private sessionService: SessionService,
    public dialog: MatDialog
  ) { }
  ngOnInit() {
    this.subscriberService.getAllSubscribersLst().subscribe((response) => {
      this.subscribersList = response.body.subMasterList;
      this.getPageChanged();
    });
  }

  openDialog(usersList, subscriberName): void {
    const dialogRef = this.dialog.open(UsersListDialogComponent, {
      width: '500px',
      data: {
        subscriberName: subscriberName,
        userDetails: usersList
      },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  viewSubscriber(item) {
    console.log(item.userId);
    if (item.userId && item.userId.length > 0) {
      this.openDialog(item.userId, item.subscriberName);
    }
  }

  pageChange(event) {
    this.currentPage = event.pageIndex;
    this.getPageChanged();
  }

  getPageChanged() {
    const start: number = this.currentPage * this.pageSize;
    const end: number = start + this.pageSize;
    this.pagedResults = this.subscribersList.slice(start, end);
  }
}
