import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-customer-po',
    templateUrl: './customer-po.component.html',
    styleUrls: ['./customer-po.component.scss']
})

export class CustomerPOComponent implements OnInit {
    customerPOForm: FormGroup;
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
        this.customerPOForm = this.formBuilder.group({
            subscriberName: new FormControl('', [Validators.required]),
            ccpdNumber: new FormControl('', [Validators.required]),
            customerPONumber: new FormControl('', [Validators.required]),
            customerPODate: new FormControl('', [Validators.required]),
            customerPOQuantity: new FormControl('', [Validators.required]),
            poNotes: new FormControl('')
        });
    }

    displayErrorMessages(field: string) {
        const control = this.customerPOForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }
}