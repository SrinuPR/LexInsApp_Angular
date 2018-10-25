import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

export interface Facilities {
  facilityId: number;
  facilityNumber: string;
  facilityName: string;
  subscriberId: number;
  subscriberName: string;
}

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  facilityForm: FormGroup;
  facilitiesList: Facilities[] = [];
  facilitiesObject: Facilities;
  displayColumns = ['Facility/Machine Number', 'Facility/Machine Name'];
  isEdit = false;
  editIndex: number;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    this.buildFormControls();
    this.facilityForm.get('subscriberName').disable();
    this.getFacilityList();
    this.setFacilityObject();
  }

  buildFormControls() {
    this.facilityForm = this.formBuilder.group({
      subscriberId: this.commonService.userDtls ? this.commonService.userDtls.subscriberId || 12345 : 12345,
      subscriberName: this.commonService.userDtls ? this.commonService.userDtls.subscriberName || 'chAITANY' : 'TEJA',
      facilityId: new FormControl(''),
      facilityNumber: new FormControl('', [Validators.required]),
      facilityName: new FormControl('', [Validators.required]),
    });
  }

  setFacilityObject() {
    this.facilitiesObject = {
      subscriberId: this.commonService.userDtls ? this.commonService.userDtls.subscriberId || 12345 : 12345,
      subscriberName: this.commonService.userDtls ? this.commonService.userDtls.subscriberName || 'chAITANY' : 'TEJA',
      facilityId: null,
      facilityName: '',
      facilityNumber: ''
    };
  }

  verifyFacilityNumber() {
    const control = this.facilityForm.get('facilityNumber').value;
    if (control.value && control.value.length > 0) {
      this.commonService.checkFacilityNumber(control.value).subscribe((response) => {
        const status = response.body.message;
        if (status === 'Facility / Machine Number Exists') {
          control.setErrors(null);
        } else {
          control.setErrors({'notUnique': true });
        }
      });
    }
  }

  getFacilityList() {
    this.commonService.getFacilityList()
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.facilitiesList = response.body.result;
        }
      },
        (error) => {
          this.commonService.triggerAlerts(
            { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
        });
  }

  onSubmit() {
    this.createShift();
  }

  createShift() {
    this.commonService.createFacility(this.getRequestObject())
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.facilitiesList = response.body.result;
          this.commonService.triggerAlerts({ message: 'Facility / Machine Saved.', showAlert: true, isSuccess: true });
        }
      },
        (error) => {
          this.commonService.triggerAlerts(
            { message: 'Shift Not Saved. Please try again.', showAlert: true, isSuccess: false });
        });
    this.resetForm();
  }

  getRequestObject() {
    this.facilitiesObject.facilityId = this.facilityForm.get('facilityId').value;
    this.facilitiesObject.facilityNumber = this.facilityForm.get('facilityNumber').value;
    this.facilitiesObject.facilityName = this.facilityForm.get('facilityName').value;
    this.facilitiesObject.subscriberId = this.commonService.userDtls.subscriberId;
    return this.facilitiesObject;
  }

  resetForm() {
    this.facilityForm.reset();
    this.facilityForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
    this.facilityForm.get('subscriberName').disable();
  }

  displayErrorMessages(field: string) {
    const control = this.facilityForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }
}

