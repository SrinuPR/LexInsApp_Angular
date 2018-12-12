import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import * as _ from 'underscore';
import { InspectionMasterService } from 'src/app/services/inspection.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
    usersListCount = 0;
    inspectionTypeList = [];
    constructor(
        private route: Router,
        public subscriberService: SubscriberService,
        public inspectionService: InspectionMasterService
    ) {}

    ngOnInit() {
        this.subscriberService.getAllSubscribers();
        this.getInspectionTypeList();
        this.getUsersList();
    }

    getUsersList() {
        this.usersListCount = 4;
    }

    getInspectionTypeList() {
        this.inspectionService.getInspectionTypeList()
        .subscribe((response) => {
          this.inspectionTypeList = response.body.inspTypeMasterList;
        });
    }

    navigateTo(path: string) {
        this.route.navigate(['admin-dashboard/' + path]);
    }
}
