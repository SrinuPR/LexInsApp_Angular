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
  currentPage = 0;
  pageSize = 5;
  pagedResults: Array<Facilities> = [];
  displayColumns = ['Facility/Machine Number', 'Facility/Machine Name'];
  isEdit = false;
  editIndex: number;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    if (this.commonService.userDtls) {
      this.buildFormControls();
      this.facilityForm.get('subscriberName').disable();
      this.getFacilityList();
      this.setFacilityObject();
    } else {
      this.router.navigate(['']);
    }
  }

  pageChange(event) {
    this.currentPage = event.pageIndex;
    this.getPageChanged();
  }

  getPageChanged() {
    const start: number = this.currentPage * this.pageSize;
    const end: number = start + this.pageSize;
    this.pagedResults = this.facilitiesList.slice(start, end);
  }

  buildFormControls() {
    this.facilityForm = this.formBuilder.group({
      subscriberName: new FormControl(this.commonService.userDtls.subscriberName),
      facilityId: new FormControl(''),
      facilityNumber: new FormControl('', [Validators.required]),
      facilityName: new FormControl('', [Validators.required]),
    });
  }

  setFacilityObject() {
    this.facilitiesObject = {
      subscriberId: this.commonService.userDtls.subscriberId,
      subscriberName: this.commonService.userDtls.subscriberName,
      facilityId: null,
      facilityName: '',
      facilityNumber: ''
    };
  }

  getFacilityList() {
    this.commonService.getFacilityList()
      .subscribe((response) => {
        if (response.body.status === 'Success') {
          this.facilitiesList = response.body.result;
          this.getPageChanged();
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
          this.getPageChanged();
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
    this.facilityForm.reset({
      subscriberName: this.commonService.userDtls.subscriberName,
      facilityId: '',
      facilityNumber: '',
      facilityName: ''
    });
    this.facilityForm.get('subscriberName').disable();
  }

  displayErrorMessages(field: string) {
    const control = this.facilityForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }

  checkDuplicates() {
    const control = this.facilityForm.get('facilityNumber');
    if (control.value) {
      this.commonService.checkFacilityNumber(control.value)
        .subscribe((response) => {
          if (response.body.message === 'Facility/Machine Number exists') {
            control.setErrors({ 'notUnique': true });
          } else {
            control.setErrors(null);
          }
        });
    }
  }

  reset() {
    this.facilityForm.reset({
      facilityId: '',
      facilityNumber: '',
      facilityName: ''
    });
  }
}

