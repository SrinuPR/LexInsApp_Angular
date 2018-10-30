import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';
import { CommonService } from '../../../services/common.service';
import { Subscriber } from '../../../interfaces/subscriber';
import { InspectionStage } from '../../../interfaces/inspection-stage';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-inspection-stage',
  templateUrl: './inspection-stage.component.html',
  styleUrls: ['./inspection-stage.component.scss']
})

export class InspectionStageComponent implements OnInit {
    inspectionStageForm: FormGroup;
    subscriber: Subscriber;
    resource = 'inspectionstage/';
    inspectionStageID = new FormControl('', [Validators.required]);
    inspectionTerm$ = this.inspectionStageID.valueChanges;
    inspectionTypeIdNotUnique =  this.inspectionTerm$.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(id =>
        this.commonService.validateResourceIdentifier(this.resource, Number(id))
        )
    );
    example = this.inspectionTypeIdNotUnique.subscribe((response) => {
      console.log('Entered in debounce loop!');
      const control = this.inspectionStageForm.get('inspectionStageID');
      const inspectionTypeExists: boolean = (response.body.inspStageId !==null);
      if (!inspectionTypeExists) {
        control.setErrors(null);
      } else {
        control.setErrors({'inspectionTypeIdNotUnique': true });
      }
    });
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public activatedRoute: ActivatedRoute
    ) { }
    ngOnInit() {
        this.prepareInitialData();
    }
    prepareInitialData() {
      this.subscriber = this.mapSubscriber();
      this.buildFormControls();
      this.inspectionStageForm.addControl('inspectionStageID', this.inspectionStageID);
    }
    mapSubscriber(): Subscriber {
      return <Subscriber>{
        subscriberId: this.commonService.userDtls.subscriberId,
        subscriberName: this.commonService.userDtls.subscriberName
      };
    }
    buildFormControls() {
      this.inspectionStageForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        inspectionStageName: new FormControl('', [Validators.required]),
      });
    }
    displayErrorMessages(field: string) {
      const control = this.inspectionStageForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }

    verifyInspectionStage() {
      const control = this.inspectionStageForm.get('inspectionStageID');
      if (control.value && control.value.length > 0) {
        this.commonService.validateResourceIdentifier(this.resource, control.value).subscribe((response) => {
          const inspectionStageExists: boolean = (response.body.inspStageId !== null);
          if (!inspectionStageExists) {
            control.setErrors(null);
          } else {
            control.setErrors({'inspectionStageIdNotUnique': true });
          }
        });
      }
    }
    createOrUpdateResource() {
      this.commonService.createOrUpdateResource(this.resource + 'create' , this.mapInspectionStage()).subscribe((response) => {
        console.log(response);
        const result = response.body;
        if (result.status === 'Success' && result.message === 'Inspection Stage Saved') {
          this.commonService.triggerAlerts({message: 'Inspection Stage Saved', showAlert: true, isSuccess: true});
          this.router.navigate(['../facilities'], {relativeTo: this.activatedRoute} );
          console.log('Subscriber saved successfully');
        }
        else {
          this.commonService.triggerAlerts({message: 'Inspection Stage not Saved. Please Try again!', showAlert: true, isSuccess: false});
        }
      },
      (error) => {
        this.commonService.triggerAlerts({message: 'Inspection Stage not Saved. Please Try again!', showAlert: true, isSuccess: false});
      });
    }
    mapInspectionStage(): InspectionStage {
      return <InspectionStage>{
        subscriberId: this.subscriber.subscriberId,
        inspStageId: Number(this.inspectionStageForm.get('inspectionStageID').value),
        inspStageName: this.inspectionStageForm.get('inspectionStageName').value,
        createdBy: this.commonService.userDtls.userName
      };
    }
}