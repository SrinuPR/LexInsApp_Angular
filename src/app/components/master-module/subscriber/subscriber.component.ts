import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})

export class SubscriberComponent implements OnInit {
    subscriberForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.subscriberForm = this.formBuilder.group({
        subscriberID: new FormControl('', [Validators.required]),
        subscriberName: new FormControl('', [Validators.required]),
        subscriberAddress: new FormControl('', [Validators.required])
      });
    }

    displayErrorMessages(field: string) {
      const control = this.subscriberForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}