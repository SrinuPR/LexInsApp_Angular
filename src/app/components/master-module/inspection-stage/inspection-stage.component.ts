import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-inspection-stage',
  templateUrl: './inspection-stage.component.html',
  styleUrls: ['./inspection-stage.component.scss']
})

export class InspectionStageComponent implements OnInit {
    inspectionStageForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.inspectionStageForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        inspectionStageID: new FormControl('', [Validators.required]),
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
}