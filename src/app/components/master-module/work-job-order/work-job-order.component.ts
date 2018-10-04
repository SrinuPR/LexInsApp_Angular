import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-work-job-order',
  templateUrl: './work-job-order.component.html',
  styleUrls: ['./work-job-order.component.scss']
})

export class WorkJobOrderComponent implements OnInit {
    workJobOrderForm: FormGroup;
    subscribersList = [
        { text: 'Deloitte', value: 1 },
        { text: 'Symphony', value: 2 }
    ]
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.workJobOrderForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        productDrawingNumberionTypeID: new FormControl('', [Validators.required]),
        customerPONumber: new FormControl('', [Validators.required]),
        workJobOrderNumber: new FormControl('', [Validators.required]),
        workJobOrderDate: new FormControl('', [Validators.required]),
        lotNumber: new FormControl('', [Validators.required]),
        lotSize: new FormControl('', [Validators.required]),
        lotSizeUnits: new FormControl('', [Validators.required]),
        manufacturingBatchNumber: new FormControl('', [Validators.required]),
        manufacturingBatchSize: new FormControl('', [Validators.required]),
        manufacturingBatchUnits: new FormControl('', [Validators.required]),
        workJobOrderNotes: new FormControl('', [Validators.required])
      });
    }

    displayErrorMessages(field: string) {
      const control = this.workJobOrderForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}