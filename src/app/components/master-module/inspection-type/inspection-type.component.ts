import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { Subscriber } from '../../../interfaces/subscriber';
import { InspectionType } from '../../../interfaces/inspection-type';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inspection-type',
  templateUrl: './inspection-type.component.html',
  styleUrls: ['./inspection-type.component.scss']
})

export class InspectionTypeComponent implements OnInit {
    inspectionTypeForm: FormGroup;
    subscriber: Subscriber;
    resource = 'inspectiontype/';
    inspectionTypeID = new FormControl('', [Validators.required]);
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public activatedRoute: ActivatedRoute
    ) { }
    ngOnInit() {
        this.subscriber = this.mapSubscriber();
        this.buildFormControls();
        this.inspectionTypeForm.get('subscriberName').disable();
        this.inspectionTypeForm.addControl('inspectionTypeID', this.inspectionTypeID);
    }
    mapSubscriber(): Subscriber {
      return <Subscriber>{
        subscriberId: this.commonService.userDtls.subscriberId,
        subscriberName: this.commonService.userDtls.subscriberName
      };
    }
    buildFormControls() {
      this.inspectionTypeForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        inspectionTypeName: new FormControl('', [Validators.required])
      });
    }
    displayErrorMessages(field: string) {
      const control = this.inspectionTypeForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
    verifyInspectionType() {
      const control = this.inspectionTypeForm.get('inspectionTypeID');
      if (control.value && control.value.length > 0 && control.value.length < 5) {
        control.setErrors({'lengthConstarint' : true});
      }
      if (control.value && control.value.length > 0) {
        this.commonService.validateResourceIdentifier(this.resource, control.value).subscribe((response) => {
          const inspectionTypeExists: boolean = (response.body.inspTypeId !== null);
          if (!inspectionTypeExists) {
            control.setErrors(null);
          } else {
            control.setErrors({'inspectionTypeIdNotUnique': true });
          }
        });
      }
    }

    createOrUpdateResource() {
      this.commonService.createOrUpdateResource(this.resource + 'create', this.mapInspectionType()).subscribe((response) => {
        console.log(response);
        const result = response.body;
        if (result.status === 'Success' && result.message === 'Inspection Type Saved') {
          this.commonService.triggerAlerts({message: 'Inspection Type Saved', showAlert: true, isSuccess: true});
          // setTimeout(() => {
          //   this.commonService.triggerAlerts({message: '', showAlert: false, isSuccess: true});
          // }, 1000);
        }
        else {
          this.commonService.triggerAlerts({message: 'Inspection Type NOT saved, please try again', showAlert: true, isSuccess: false});
        }
      });
    }
    mapInspectionType(): InspectionType {
      return <InspectionType>{
        subscriberId: this.subscriber.subscriberId,
        inspTypeId: this.inspectionTypeForm.get('inspectionTypeID').value,
        inspTypeName: this.inspectionTypeForm.get('inspectionTypeName').value,
        createdBy: this.commonService.userDtls.userName
      };
    }
}