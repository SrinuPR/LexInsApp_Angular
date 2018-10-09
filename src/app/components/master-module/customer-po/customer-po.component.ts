import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { CustomerPO } from '../../../interfaces/customer-po';
import * as _ from 'underscore';

@Component({
    selector: 'app-customer-po',
    templateUrl: './customer-po.component.html',
    styleUrls: ['./customer-po.component.scss']
})

export class CustomerPOComponent implements OnInit {
    customerPOForm: FormGroup;
    displayColumns = ['Product Draw Number', 'Customer PO Number', 'Customer PO Date', 'Customer PO Quantity'];
    subscribersList = [
        { text: 'Deloitte', value: 1 },
        { text: 'Symphony', value: 2 }
    ];
    customerPOList: CustomerPO[] = [];
    customerPObject: CustomerPO;
    isEdit = false;
    editIndex: number;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public dataService: DataService
    ) { }
    ngOnInit() {
        this.buildFormControls();
        this.getcustomerPOList();
        this.setcustomerPObject();
    }

    setcustomerPObject() {
        this.customerPObject = {
            subscriberId: this.dataService.subsrciberDetails.subscriberId,
            subscriberName: this.dataService.subsrciberDetails.subscriberName,
            componentId: 0,
            customerPOId: null,
            customerPONumber: '',
            customerPODate: '',
            customerPOQuantity: '',
            poNotes: ''
        };
    }
    
    buildFormControls() {
        this.customerPOForm = this.formBuilder.group({
            subscriberName: new FormControl(''),
            customerPOId: new FormControl(''),
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
        this.commonService.getCustomerPOList()
            .subscribe((response) => {
                console.log(response);
            });
    }

    onEdit(element: CustomerPO, index: number) {
        this.editIndex = index;
        this.isEdit = true;
        this.customerPOForm.get('customerPOId').setValue(element.componentId);
        this.customerPOForm.get('componentId').setValue(element.componentId);
        this.customerPOForm.get('subscriberName').setValue(this.dataService.subsrciberDetails.subscriberName);
        this.customerPOForm.get('customerPONumber').setValue(element.customerPONumber);
        this.customerPOForm.get('customerPODate').setValue(element.customerPODate);
        this.customerPOForm.get('customerPOQuantity').setValue(element.customerPOQuantity);
        this.customerPOForm.get('poNotes').setValue(element.poNotes);
    }

    delete(element: CustomerPO) {
        this.customerPOList = _.without(this.customerPOList, element);
        this.resetForm();
    }

    onSubmit() {
        if (!this.isEdit) {
            this.createComponentProductMaster();
        } else {
            this.updateComponentProductMaster();
        }
        this.isEdit = false;
        this.resetForm();
    }

    createComponentProductMaster() {
        this.commonService.createCustomerPO(this.getRequestObject())
            .subscribe((response) => {
                console.log(response);
            });

    }

    updateComponentProductMaster() {
        this.commonService.updateCustomerPO(this.getRequestObject())
            .subscribe((response) => {
                console.log(response);
            });
    }

    getRequestObject() {
        this.customerPObject.customerPOId = this.customerPOForm.get('customerPOId') ? this.customerPOForm.get('customerPOId').value || null : null;
        this.customerPObject.subscriberId = 12345;
        this.customerPObject.componentId = this.customerPOForm.get('componentId').value;
        this.customerPObject.customerPONumber = this.customerPOForm.get('customerPONumber').value;
        this.customerPObject.customerPODate = this.customerPOForm.get('customerPODate').value;
        this.customerPObject.customerPOQuantity = this.customerPOForm.get('customerPOQuantity').value;
        this.customerPObject.poNotes = this.customerPOForm.get('poNotes').value;
        return this.customerPObject;
    }

    resetForm() {
        this.customerPOForm.reset();
        this.customerPOForm.get('subscriberName').setValue(this.dataService.subsrciberDetails.subscriberName);
        this.customerPOForm.get('subscriberName').disable();
    }
}