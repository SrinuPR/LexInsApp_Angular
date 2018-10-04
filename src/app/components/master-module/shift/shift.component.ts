import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})

export class ShiftComponent implements OnInit {
    shiftForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.shiftForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        shiftID: new FormControl('', [Validators.required]),
        shiftName: new FormControl('', [Validators.required]),
      });
    }

    displayErrorMessages(field: string) {
      const control = this.shiftForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}