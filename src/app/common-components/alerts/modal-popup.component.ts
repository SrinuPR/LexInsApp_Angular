import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Alert, AlertType } from 'src/app/interfaces/alert';

@Component({
  selector: 'app-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopUpComponent {
  alertType = AlertType;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Alert) {}

  onOK() {
    this.dialogRef.close();
  }

  getTitle(): string {
      if (this.data.type === this.alertType.WARNING) {
        return 'WARNING';
      } else if (this.data.type === this.alertType.ERROR) {
        return 'ERROR';
      } else {
        return 'INFORMATION';
      }
  }

}
