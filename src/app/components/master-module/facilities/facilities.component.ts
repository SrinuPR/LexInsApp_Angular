import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
    facilityForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.facilityForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        facilityNumber: new FormControl('', [Validators.required]),
        facilityName: new FormControl('', [Validators.required]),
      });
    }

    displayErrorMessages(field: string) {
      const control = this.facilityForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}