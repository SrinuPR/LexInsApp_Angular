import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-inspection-line-item',
    templateUrl: './inspection-line-item.component.html',
    styleUrls: ['./inspection-line-item.component.scss']
})

export class InspectionLineItemComponent implements OnInit {
    inspectionLineItemForm: FormGroup;
    measurementObject = { measurementName: 'dafsdf', baseMeasure: ' fasd', baseMeasureUnits: '23', upperLimit: '23',lowerLimit: '23' };
    subscribersList = [
        { text: 'Deloitte', value: 1 },
        { text: 'Symphony', value: 2 }
    ];
    headerColumns: string[] = [
        'Measurement Name',
        'Base Measure',
        'Base Measure Units',
        'Upper Limit (+ Tolerance)',
        'Lower Limit (- Tolerance)'];
    dataSource = [this.measurementObject];

    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }

    buildFormControls() {
        this.inspectionLineItemForm = this.formBuilder.group({
            subscriberName: new FormControl(''),
            componentProductDrawingNumber: new FormControl('', [Validators.required])
        });
    }

    displayErrorMessages(field: string) {
        const control = this.inspectionLineItemForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    addNewRow() {
        this.dataSource.push(this.measurementObject);
    }
}