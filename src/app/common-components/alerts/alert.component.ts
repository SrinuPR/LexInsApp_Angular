import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Alert } from 'src/app/interfaces/alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertsComponent {
  showAlert = false;
  message = '';
  isSuccess = true;
  constructor(
    public commonService: CommonService
  ) {
    this.commonService.showAlertsTrigger.subscribe((alertObject: Alert) => {
      this.triggerAlert(alertObject);
    });

    this.commonService.clearAlertsEvent.subscribe(data => this.clearAlerts());
  }

  triggerAlert(event) {
    this.message = event.message;
    this.showAlert = event.showAlert;
    this.isSuccess = event.isSuccess;
  }

  close() {
    this.showAlert = false;
  }

  clearAlerts() {
    this.showAlert = false;
  }

}
