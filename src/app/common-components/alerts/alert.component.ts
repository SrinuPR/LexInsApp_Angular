import { Component, Input } from '@angular/core';
import { CommonService, Alert } from 'src/app/services/common.service';

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
    })
  }

  triggerAlert(event) {
    this.message = event.message;
    this.showAlert = event.showAlert;
    this.isSuccess = event.isSuccess;
  }

  close() {
    this.showAlert = false;
  }

}
