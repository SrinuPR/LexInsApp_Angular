import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-inspection-line-item',
    templateUrl: './inspection-line-item.component.html',
    styleUrls: ['./inspection-line-item.component.scss']
})

export class InspectionLineItemComponent implements OnInit {
    inspectionLineItemForm: FormGroup;
    productDrawingList = [];
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'symbol1'];
    headerColumns: string[] = [
        'Measurement Name',
        'Base Measure',
        'Base Measure Units',
        'Upper Limit (+ Tolerance)',
        'Lower Limit (- Tolerance)'];
    dataSource = [];
    get measureItems(): FormArray {
        return <FormArray>this.inspectionLineItemForm.get('measureItems');
    }
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        if (this.commonService.userDtls) {
            this.getDrawingNumberList();
            this.buildFormControls();
            this.getInspectionLineItemList();
            this.inspectionLineItemForm.get('subscriberName').disable();
        } else {
            this.router.navigate(['']);
        }
    }

    getInspectionLineItemList() {
        this.commonService.getInspectionLineItemList(this.commonService.userDtls.subscriberId).subscribe((response) => {
            if (response.body.status === 'Success') {
                this.resetMeasureItems(response.body.results);
            }
        });
    }

    getDrawingNumberList() {
        this.commonService.getDrawingNumberList(this.commonService.userDtls.subscriberId)
            .subscribe((response) => {
                if (response.body.status === 'Success') {
                    this.productDrawingList = response.body.result;
                }
            },
                (error) => {
                    this.commonService.triggerAlerts(
                        { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
                });
    }

    buildFormControls() {
        this.inspectionLineItemForm = this.formBuilder.group({
            subscriberName: new FormControl(this.commonService.userDtls.subscriberName),
            componentProductDrawingNumber: new FormControl('', [Validators.required]),
            measureItems: this.formBuilder.array([])
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
        const formGroup = this.formBuilder.group({
            inspectionLineItemId: new FormControl(null),
            measurementName: new FormControl('', [Validators.required]),
            baseMeasure: new FormControl('', [Validators.required]),
            baseMeasureUnits: new FormControl('', [Validators.required]),
            upperLimit: new FormControl('', [Validators.required]),
            lowerLimit: new FormControl('', [Validators.required])
        });
        this.measureItems.push(formGroup);
    }

    isAddRowDisabaled() {
        if (this.inspectionLineItemForm.get('componentProductDrawingNumber').valid) {
            if (this.measureItems.controls.length) {
                const measureItemForm = this.measureItems.controls[this.measureItems.controls.length - 1];
                if (measureItemForm.valid) {
                    return !(measureItemForm.get('inspectionLineItemId').value);
                }
                return true;
            }
            return false;
        }
        return true;
    }

    isMearsureItemDisabled() {
        if (this.measureItems.controls.length) {
            const measureItemForm = this.measureItems.controls[this.measureItems.controls.length - 1];
            return !measureItemForm.valid;
        }
        return true;
    }

    checkMeasureName(index) {
        const control = this.measureItems.controls[index].get('measurementName');
        if (control.value) {
            this.commonService.checkMeasureName(
                this.getMeasureItemObject(this.measureItems.controls[index], true)).subscribe((response) => {
                    control.setErrors(null);
                },
                    (error) => {
                        if (error.error.message === 'Measurement Name exists') {
                            control.setErrors({ 'incorrect': true });
                        } else {
                            control.setErrors(null);
                        }
                    });
        }
    }

    showMessage(index) {
        const control = this.measureItems.controls[index].get('measurementName');
        if (control.value && !control.disabled) {
            return !control.valid;
        }
        return false;
    }

    saveMearsureItem(isReport) {
        this.commonService.saveMeasureItem(this.getReportData()).subscribe((response) => {
            if (response.body.status === 'Success') {
                this.resetMeasureItems(response.body.results);
                this.commonService.triggerAlerts({
                    message: isReport ? 'Inspection Measurement Master Saved.'
                        : 'Inspection Measurement Item Saved.', showAlert: true, isSuccess: true
                });
            }
        },
            (error) => {
                this.commonService.triggerAlerts(
                    {
                        message: isReport ? 'Inspection Measurement Master NOT Saved. Please try again.'
                            : 'Inspection Measurement Item NOT Saved. Please try again.', showAlert: true, isSuccess: false
                    });
            });
    }

    getReportData() {
        const body = [];
        this.measureItems.controls.forEach(measureItem => {
            body.push(this.getMeasureItemObject(measureItem));
        });
        return body;
    }

    resetMeasureItems(data) {
        const measureItemsList = _.sortBy(data, 'inspectionLineItemId');
        this.measureItems.controls = [];
        _.forEach(measureItemsList, (item: Measurement) => {
            const formGroup = this.formBuilder.group({
                inspectionLineItemId: new FormControl(item.inspectionLineItemId),
                measurementName: new FormControl(item.measurementName, [Validators.required]),
                baseMeasure: new FormControl(item.baseMeasure, [Validators.required]),
                baseMeasureUnits: new FormControl(item.baseMeasureUnits, [Validators.required]),
                upperLimit: new FormControl(item.upperLimit, [Validators.required]),
                lowerLimit: new FormControl(item.lowerLimit, [Validators.required])
            });
            this.measureItems.push(formGroup);
            this.measureItems.controls[this.measureItems.length - 1].get('measurementName').disable();
        });
    }

    getMeasureItemObject(measureItem: AbstractControl, isCheck = false) {
        return {
            subscriberId: isCheck ? null : this.commonService.userDtls.subscriberId,
            subscriberName: isCheck ? null : this.commonService.userDtls.subscriberName,
            inspectionLineItemId: isCheck ? null : measureItem.get('inspectionLineItemId').value,
            componentProductDrawNumber: this.inspectionLineItemForm.get('componentProductDrawingNumber').value,
            measurementName: measureItem.get('measurementName').value,
            baseMeasure: isCheck ? null : measureItem.get('baseMeasure').value,
            baseMeasureUnits: isCheck ? null : measureItem.get('baseMeasureUnits').value,
            upperLimit: isCheck ? null : parseFloat(measureItem.get('upperLimit').value),
            lowerLimit: isCheck ? null : parseFloat(measureItem.get('lowerLimit').value),
            userId: this.commonService.userDtls.userId,
            userName: this.commonService.userDtls.userName
        };
    }
}

interface Measurement {
    inspectionLineItemId?: string;
    measurementName: string;
    baseMeasure: string;
    baseMeasureUnits: string;
    upperLimit: string;
    lowerLimit: string;
}
