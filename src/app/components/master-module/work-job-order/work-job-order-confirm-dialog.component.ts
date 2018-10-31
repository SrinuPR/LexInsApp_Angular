import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkJobOrderComponent } from './work-job-order.component';
import { WorkJobOrderDialog } from 'src/app/interfaces/work-job-order';
import { AlertType } from 'src/app/interfaces/alert';

@Component({
    selector: 'app-work-job-order-confirm-dialog',
    templateUrl: 'work-job-order-confirm-dialog.component.html',
    styleUrls: ['./work-job-order-confirm-dialog.component.scss']
  })
  export class WorkJobOrderConfirmDialogComponent {
    alertType = AlertType;
    constructor(
      public dialogRef: MatDialogRef<WorkJobOrderComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: WorkJobOrderDialog) {}

    onYes() {
      this.dialogData.confirm = true;
      this.dialogRef.close(this.dialogData);
    }

    onReEnter() {
      this.dialogData.confirm = false;
      this.dialogRef.close(this.dialogData);
    }
  }
