import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertType } from 'src/app/interfaces/alert';
import { InspectionMeasurementDialog } from 'src/app/interfaces/inspection-measurement';
import { InspectionMeasurementsComponent } from './inspection-measurements.component';

@Component({
    selector: 'app-work-job-order-confirm-dialog',
    templateUrl: '../work-job-order/work-job-order-confirm-dialog.component.html',
    styleUrls: ['../work-job-order/work-job-order-confirm-dialog.component.scss']
  })
  export class InspectionMeasurementConfirmDialogComponent {
    alertType = AlertType;
    constructor(
      public dialogRef: MatDialogRef<InspectionMeasurementsComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: InspectionMeasurementDialog) {}

    onYes() {
      this.dialogData.confirm = true;
      this.dialogRef.close(this.dialogData);
    }

    onReEnter() {
      this.dialogData.confirm = false;
      this.dialogRef.close(this.dialogData);
    }
  }
