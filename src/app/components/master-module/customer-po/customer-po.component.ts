import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { CustomerPO } from '../../../interfaces/customer-po';
import * as _ from 'underscore';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';

@Component({
    selector: 'app-customer-po',
    templateUrl: './customer-po.component.html',
    styleUrls: ['./customer-po.component.scss']
})

export class CustomerPOComponent implements OnInit {
    @ViewChild('f') myNgForm;
    customerPOForm: FormGroup;
    isUpdate = false;
    displayColumns = ['Product Draw Number', 'Customer PO Number', 'Customer PO Date', 'Customer PO Quantity'];
    customerPOList: CustomerPO[] = [];
    customerPObject: CustomerPO;
    componentProductDrawingNumberList: ComponentProductMaster[] = [];
    isEdit = false;
    editIndex: number;
    currentPage = 0;
    pageSize = 5;
    pagedResults: Array<CustomerPO> = [];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        if (this.commonService.userDtls) {
            this.buildFormControls();
            this.customerPOForm.get('subscriberName').disable();
            this.getcustomerPOList();
            this.setcustomerPObject();
        } else {
            this.router.navigate(['']);
        }
    }

    pageChange(event) {
        this.currentPage = event.pageIndex;
        this.getPageChanged();
    }
    getPageChanged() {
        const start: number = this.currentPage * this.pageSize;
        const end: number = start + this.pageSize;
        this.pagedResults = this.customerPOList.slice(start, end);
    }

    setcustomerPObject() {
        this.customerPObject = {
            subscriberId: this.commonService.userDtls.subscriberId,
            subscriberName: this.commonService.userDtls.subscriberName,
            componentId: 0,
            customerPoId: null,
            customerPONumber: '',
            customerPODate: '',
            customerPOQuantity: null,
            poNotes: '',
            componentProductDrawNum: ''
        };
    }

    buildFormControls() {
        this.customerPOForm = this.formBuilder.group({
            subscriberName: new FormControl(this.commonService.userDtls.subscriberName),
            customerPoId: new FormControl(''),
            componentId: new FormControl('', [Validators.required]),
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

    getcustomerPOList() {
        this.commonService.getComponentProductMasterList()
            .subscribe((response) => {
                if (response.body.status === 'Success') {
                    this.componentProductDrawingNumberList = response.body.result;
                }
            });
        this.commonService.getCustomerPOList()
            .subscribe((response) => {
                if (response.body.status === 'Success') {
                    this.customerPOList = response.body.result;
                    if (this.customerPOList.length !== null && this.customerPOList.length !== 0 ) {
                        this.getPageChanged();
                    }
                }
            });
    }

    onEdit(element: CustomerPO, index: number) {
        this.editIndex = index;
        this.isEdit = true;
        this.customerPOForm.get('customerPoId').setValue(element.customerPoId);
        this.customerPOForm.get('componentId').setValue(element.componentId);
        this.customerPOForm.get('componentId').disable();
        this.customerPOForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
        this.customerPOForm.get('customerPONumber').setValue(element.customerPONumber);
        this.customerPOForm.get('customerPONumber').disable();
        this.customerPOForm.get('customerPODate').setValue(new Date(element.customerPODate).toISOString());
        this.customerPOForm.get('customerPODate').disable();
        this.customerPOForm.get('customerPOQuantity').setValue(element.customerPOQuantity);
        this.customerPOForm.get('poNotes').setValue(element.poNotes);
    }

    delete(element: CustomerPO) {
        this.commonService.deleteCustomerPO(element.customerPoId)
            .subscribe((response) => {
                this.customerPOList = _.without(this.customerPOList, element);
                if (this.customerPOList !== null && this.customerPOList.length !== 0) {
                    this.getPageChanged();
                }
                this.commonService.triggerAlerts(
                    { message: response.body.message, showAlert: true, isSuccess: true });
            },
                (error) => {
                    this.commonService.triggerAlerts(
                        { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
                });
    }

    onSubmit() {
        if (!this.isEdit) {
            this.createCustomerPO();
        } else {
            this.updateCustomerPO();
        }
        this.isEdit = false;
    }

    createCustomerPO() {
        this.commonService.createCustomerPO(this.getRequestObject())
            .subscribe((response) => {
                if (response.body.status === 'Success') {
                    this.customerPOList = response.body.result;
                    this.getPageChanged();
                    this.resetForm();
                    this.commonService.triggerAlerts({ message: 'Customer PO Saved.', showAlert: true, isSuccess: true });
                }
            }, (error) => {
                this.commonService.triggerAlerts(
                    { message: 'Customer PO NOT Saved. Please try again.', showAlert: true, isSuccess: false });
                this.resetForm();
            });

    }

    updateCustomerPO() {
        this.commonService.updateCustomerPO(this.getRequestObject())
            .subscribe((response) => {
                if (response.body.status === 'Success') {
                    this.customerPOList = response.body.result;
                    this.getPageChanged();
                    this.commonService.triggerAlerts({ message: 'Customer PO Saved.', showAlert: true, isSuccess: true });
                    this.resetForm();
                }
            },
                (error) => {
                    this.commonService.triggerAlerts(
                        { message: 'Customer PO NOT Saved. Please try again.', showAlert: true, isSuccess: false });
                    this.resetForm();
                });
    }

    getRequestObject() {
        this.customerPObject.customerPoId = this.customerPOForm.get('customerPoId')
            ? this.customerPOForm.get('customerPoId').value || null : null;
        this.customerPObject.componentId = this.customerPOForm.get('componentId').value;
        this.customerPObject.subscriberId = this.commonService.userDtls.subscriberId;
        this.customerPObject.customerPONumber = this.customerPOForm.get('customerPONumber').value;
        this.customerPObject.customerPODate = this.toLocaleDate(this.customerPOForm.get('customerPODate').value);
        this.customerPObject.customerPOQuantity = this.customerPOForm.get('customerPOQuantity').value;
        this.customerPObject.poNotes = this.customerPOForm.get('poNotes').value;
        return this.customerPObject;
    }
    toLocaleDate(value: string): string {
        if (value) {
            const localDate = new Date(value);
            return localDate.getDate() + '/' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear();
        }
    }

    resetForm() {
        this.myNgForm.resetForm();
        this.customerPOForm.reset();
        this.customerPOForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
        this.customerPOForm.get('subscriberName').disable();
        this.customerPOForm.get('componentId').enable();
        this.customerPOForm.get('customerPONumber').enable();
        this.customerPOForm.get('customerPODate').enable();
    }

    cancelEdit() {
        this.resetForm();
        this.isEdit = false;
    }

    onDrawNumberChange() {
        const componentId = this.customerPOForm.get('componentId').value;
        const data = _.where(this.componentProductDrawingNumberList, { componentId: componentId });
        if (data) {
            this.customerPObject.componentProductDrawNum = data[0].componentProductDrawNumber;
        }
    }

    checkDuplicates() {
        const control = this.customerPOForm.get('customerPONumber');
        this.commonService.checkDuplicateCustomerPO(control.value)
            .subscribe((response) => {
                control.setErrors(null);
            },
                (error) => {
                    control.setErrors({ 'notUnique': true });
                });
    }
}
