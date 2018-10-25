import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkJobOrderComponent } from './work-job-order.component';
import { WorkJobOrderDialog } from 'src/app/interfaces/work-job-order';

@Component({
    selector: 'app-work-job-order-confirm-dialog',
    templateUrl: 'work-job-order-confirm-dialog.component.html',
    styleUrls: ['./work-job-order-confirm-dialog.component.scss']
  })
  export class WorkJobOrderConfirmDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<WorkJobOrderComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: WorkJobOrderDialog) {}

    onYes() {
      this.dialogData.workJobOrderAcknwldgmnt = true;
      this.dialogRef.close(this.dialogData);
    }

    onNo() {
      this.dialogData.workJobOrderAcknwldgmnt = false;
      this.dialogRef.close(this.dialogData);
    }
  }
