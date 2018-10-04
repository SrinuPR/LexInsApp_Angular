import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-type-master',
    templateUrl: './user-type-master.component.html',
    styleUrls: ['./user-type-master.component.scss']
})

export class UserTypeMasterComponent implements OnInit {
    userMasterForm: FormGroup;
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
        this.userMasterForm = this.formBuilder.group({
            subscriberID: new FormControl('', [Validators.required]),
            userTypeID: new FormControl('', [Validators.required]),
            userTypeName: new FormControl('', [Validators.required])
        });
    }

    displayErrorMessages(field: string) {
        const control = this.userMasterForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }
}