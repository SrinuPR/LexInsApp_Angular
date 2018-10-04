import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-inspections',
    templateUrl: './inspections.component.html',
    styleUrls: ['./inspections.component.scss']
})

export class InspectionsComponent implements OnInit {
    inspectionsForm: FormGroup;
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
        this.inspectionsForm = this.formBuilder.group({
            subscriberName: new FormControl('', [Validators.required]),
            componentProductDrawingNumber: new FormControl('', [Validators.required]),
            componentProductName: new FormControl('', [Validators.required]),
            componentProductNumber: new FormControl('', [Validators.required]),
            componentProductMaterial: new FormControl('', [Validators.required]),
            inspectionType: new FormControl('', [Validators.required]),
            inspectionStage: new FormControl('', [Validators.required]),
            componentProductNotes: new FormControl('', [Validators.required])
        });
    }

    displayErrorMessages(field: string) {
        const control = this.inspectionsForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }
}