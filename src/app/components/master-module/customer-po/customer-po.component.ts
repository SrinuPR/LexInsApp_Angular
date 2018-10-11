import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
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
    customerPOForm: FormGroup;
    displayColumns = ['Product Draw Number', 'Customer PO Number', 'Customer PO Date', 'Customer PO Quantity'];
    customerPOList: CustomerPO[] = [];
    customerPObject: CustomerPO;
    componentProductDrawingNumberList: ComponentProductMaster[] = [];
    isEdit = false;
    editIndex: number;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        this.buildFormControls();
        this.customerPOForm.get('subscriberName').disable();
        this.getcustomerPOList();
        this.setcustomerPObject();
    }

    setcustomerPObject() {
        this.customerPObject = {
            subscriberId: this.commonService.userDtls.subscriberId,
            subscriberName: this.commonService.userDtls.subscriberName,
            componentId: 0,
            customerPoId: null,
            customerPONumber: '',
            customerPODate: '',
            customerPOQuantity: '',
            poNotes: ''
        };
    }

    buildFormControls() {
        this.customerPOForm = this.formBuilder.group({
            subscriberName: new FormControl(''),
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
                this.componentProductDrawingNumberList = response.body;
            });
        this.commonService.getCustomerPOList()
            .subscribe((response) => {
                this.customerPOList = response.body;
            });
    }

    onEdit(element: CustomerPO, index: number) {
        this.editIndex = index;
        this.isEdit = true;
        this.customerPOForm.get('customerPoId').setValue(element.customerPoId);
        this.customerPOForm.get('componentId').setValue(element.componentId);
        this.customerPOForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
        this.customerPOForm.get('customerPONumber').setValue(element.customerPONumber);
        this.customerPOForm.get('customerPODate').setValue(element.customerPODate);
        this.customerPOForm.get('customerPOQuantity').setValue(element.customerPOQuantity);
        this.customerPOForm.get('poNotes').setValue(element.poNotes);
    }

    delete(element: CustomerPO) {
        this.commonService.deleteCustomerPO(element.componentId)
            .subscribe((response) => {
                this.customerPOList = _.without(this.customerPOList, element);
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
        this.resetForm();
    }

    createCustomerPO() {
        const checkDuplicate = _.find(this.customerPOList,
            { componentProductDrawNumber: this.getRequestObject().customerPONumber });
        if (checkDuplicate) {
            this.commonService.triggerAlerts({ message: 'Customer P.O. Exists.', showAlert: true, isSuccess: false });
        } else {
            this.commonService.createCustomerPO(this.getRequestObject())
                .subscribe((response) => {
                    this.customerPOList = response.body;
                    this.commonService.triggerAlerts({ message: 'Customer P.O. Saved.', showAlert: true, isSuccess: true });
                },
                    (error) => {
                        this.commonService.triggerAlerts(
                            { message: 'Customer P.O. NOT Saved. Please try again.', showAlert: true, isSuccess: false });
                    });
            this.resetForm();
        }
    }

    updateCustomerPO() {
        this.commonService.updateCustomerPO(this.getRequestObject())
            .subscribe((response) => {
                this.customerPOList = response.body;
                this.commonService.triggerAlerts({ message: 'Customer P.O. Saved.', showAlert: true, isSuccess: true });
            },
                (error) => {
                    this.commonService.triggerAlerts(
                        { message: 'Customer P.O. NOT Saved. Please try again.', showAlert: true, isSuccess: false });
                });
    }

    getRequestObject() {
        this.customerPObject.customerPoId = this.customerPOForm.get('customerPoId')
            ? this.customerPOForm.get('customerPoId').value || null : null;
        this.customerPObject.subscriberId = this.commonService.userDtls.subscriberId;
        this.customerPObject.componentId = this.customerPOForm.get('componentId').value;
        this.customerPObject.customerPONumber = this.customerPOForm.get('customerPONumber').value;
        this.customerPObject.customerPODate = this.customerPOForm.get('customerPODate').value;
        this.customerPObject.customerPOQuantity = this.customerPOForm.get('customerPOQuantity').value;
        this.customerPObject.poNotes = this.customerPOForm.get('poNotes').value;
        return this.customerPObject;
    }

    resetForm() {
        this.customerPOForm.reset();
        this.customerPOForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
        this.customerPOForm.get('subscriberName').disable();
    }
}
