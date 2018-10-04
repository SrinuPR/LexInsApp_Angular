import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-inspection-type',
  templateUrl: './inspection-type.component.html',
  styleUrls: ['./inspection-type.component.scss']
})

export class InspectionTypeComponent implements OnInit {
    inspectionTypeForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.inspectionTypeForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        inspectionTypeID: new FormControl('', [Validators.required]),
        inspectionTypeName: new FormControl('', [Validators.required]),
      });
    }

    displayErrorMessages(field: string) {
      const control = this.inspectionTypeForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}