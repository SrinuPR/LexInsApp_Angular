import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { CommonService } from 'src/app/services/common.service';

export interface Shift {
  shiftId: string;
  shiftName: string;
  subscriberId: number;
  subscriberName: string;
}

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})

export class ShiftComponent implements OnInit {
  shiftForm: FormGroup;
  shiftList: Shift[] = [];
  shiftObject: Shift;
  displayColumns = ['Shift ID', 'Shift Name'];
  isEdit = false;
  editIndex: number;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
  ) { }
  ngOnInit() {
    this.buildFormControls();
    this.shiftForm.get('subscriberName').disable();
    this.getShiftList();
    this.setShiftObject();
  }

  buildFormControls() {
    this.shiftForm = this.formBuilder.group({
      subscriberId: this.commonService.userDtls ? this.commonService.userDtls.subscriberId || 12345 : 12345,
      subscriberName: this.commonService.userDtls ? this.commonService.userDtls.subscriberName || 'chAITANY' : 'TEJA',
      shiftID: new FormControl('', [Validators.required]),
      shiftName: new FormControl('', [Validators.required]),
    });
  }

  setShiftObject() {
    this.shiftObject = {
      subscriberId: this.commonService.userDtls ? this.commonService.userDtls.subscriberId || 12345 : 12345,
      subscriberName: this.commonService.userDtls ? this.commonService.userDtls.subscriberName || 'chAITANY' : 'TEJA',
      shiftId: '',
      shiftName: ''
    };
  }

  getShiftList() {
    this.commonService.getShiftList()
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.shiftList = response.body.result;
        }
      },
        (error) => {
          this.commonService.triggerAlerts(
            { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
        });
  }

  onEdit(element: Shift) {
    this.isEdit = true;
    this.shiftForm.get('shiftId').setValue(element.shiftId);
    this.shiftForm.get('shiftId').disable();
    this.shiftForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
    this.shiftForm.get('shiftName').setValue(element.shiftName);
  }

  delete(element: Shift) {
    this.commonService.deleteShift(element.shiftId)
      .subscribe((response) => {
        console.log('success');
        this.shiftList = _.without(this.shiftList, element);
      },
        (error) => {
          console.log(error);
          this.commonService.triggerAlerts(
            { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
        });
  }

  onSubmit() {
    if (!this.isEdit) {
      this.createShift();
    } else {
      this.updateShift();
    }
  }

  createShift() {
    this.commonService.createShift(this.getRequestObject())
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.shiftList = response.body.result;
          this.commonService.triggerAlerts({ message: 'Shift Saved.', showAlert: true, isSuccess: true });
        } else {
          this.commonService.triggerAlerts(
            { message: 'Shift ID Exists.', showAlert: true, isSuccess: false });
        }
      },
        (error) => {
          this.commonService.triggerAlerts(
            { message: 'Shift Not Saved. Please try again.', showAlert: true, isSuccess: false });
        });
    this.resetForm();
  }

  updateShift() {
    this.commonService.updateShift(this.getRequestObject())
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.shiftList = response.body.result;
          this.commonService.triggerAlerts({ message: 'Shift Updated.', showAlert: true, isSuccess: true });
        }
      },
        (error) => {
          this.commonService.triggerAlerts(
            { message: 'Shift Not Saved. Please try again.', showAlert: true, isSuccess: false });
        });
    this.resetForm();
    this.isEdit = false;
  }

  getRequestObject() {
    this.shiftObject.shiftId = this.shiftForm.get('shiftId').value;
    this.shiftObject.subscriberId = this.commonService.userDtls.subscriberId;
    this.shiftObject.shiftName = this.shiftForm.get('shiftName').value;
    return this.shiftObject;
  }

  resetForm() {
    this.shiftForm.reset();
    this.shiftForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
    this.shiftForm.get('subscriberName').disable();
  }

  cancelEdit() {
    this.resetForm();
    this.isEdit = false;
  }

  displayErrorMessages(field: string) {
    const control = this.shiftForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }
}
