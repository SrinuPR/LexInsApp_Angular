import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import * as _ from 'underscore';
import { InspectionMasterService } from 'src/app/services/inspection.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
    dashBoardDTOCounts: DashBoardDTO;
    constructor(
        private route: Router,
        public commonService: CommonService
    ) { }

    ngOnInit() {
        this.getdashboardDeatils();
    }

    getdashboardDeatils() {
        this.commonService.getMSubscriberDashBoardDetails()
            .subscribe((response) => {
                this.dashBoardDTOCounts = response.body.dashBoardDTO;
                console.log(this.dashBoardDTOCounts);
            });
    }

    setActiveLink(activeRoute) {
        this.commonService.leftNavJSON.forEach((item) => {
            item.isActive = (activeRoute === item.route);
        });
    }

    navigateTo(path: string) {
        const isAccessable = _.find(this.commonService.leftNavJSON, { 'route': path });
        if (isAccessable) {
            this.setActiveLink(path);
            this.route.navigate(['dashboard/' + path]);
        }
    }
}

export interface DashBoardDTO {
    componentCount?: Number;
    customerPOCount?: Number;
    inspectionLineItemCount?: Number;
    inspectionMeasurementCount?: Number;
    inspectionReportCount?: Number;
    workJobOrderCount?: Number;
}
