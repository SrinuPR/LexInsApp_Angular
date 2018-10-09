import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentProductMaster } from '../../../interfaces/component-product-master';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import * as _ from 'underscore';
import { AlertsComponent } from '../../../common-components/alerts/alert.component';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})

export class ComponentMasterComponent implements OnInit {
  componentMasterForm: FormGroup;
  componentProductMasterList: ComponentProductMaster[] = [];
  componentProductMasterObject: ComponentProductMaster;
  displayColumns = ['Product Draw Number', 'Product Name', 'Product Number', 'Manufacturer Units', 'Address'];
  isEdit = false;
  editIndex: number;
  constructor(
      public router: Router,
      public formBuilder: FormBuilder,
      public commonService: CommonService,
      public dataService: DataService,
      public alertComponent: AlertsComponent
  ) { }
  ngOnInit() {
    
    this.buildFormControls();
    this.componentMasterForm.get('subscriberName').disable();
    this.getComponentProductMasterList();
    this.setComponentProductMasterObject();
  }

  setComponentProductMasterObject() {
    this.componentProductMasterObject = {
      subscriberId: this.dataService.subsrciberDetails.subscriberId,
      subscriberName: this.dataService.subsrciberDetails.subscriberName,
      componentId: null,
      componentProductDrawNumber: '',
      componentProductName: '',
      componentProductNumber: '',
      componentProductMeterial: '',
      componentProductManufacturerUnits: '',
      customerNameAddress: '',
      componentProductNotes: ''
    };
  }

  buildFormControls() {
    this.componentMasterForm = this.formBuilder.group({
      componentId: new FormControl(null),
      subscriberName: new FormControl(this.dataService.subsrciberDetails.subscriberName),
      componentProductDrawNumber: new FormControl('', [Validators.required]),
      componentProductName: new FormControl('', [Validators.required]),
      componentProductNumber: new FormControl('', [Validators.required]),
      componentProductMeterial: new FormControl('', [Validators.required]),
      componentProductManufacturerUnits: new FormControl('', [Validators.required]),
      customerNameAddress: new FormControl('', [Validators.required]),
      componentProductNotes: new FormControl('')
    });
  }

  displayErrorMessages(field: string) {
    const control = this.componentMasterForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }

  getComponentProductMasterList() {
    this.commonService.getComponentProductMasterList()
    .subscribe((response) => {
      this.componentProductMasterList = response.body;
    },
    (error) => {
      this.commonService.triggerAlerts({message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false});
    });
  }

  onEdit(element: ComponentProductMaster, index: number) {
    this.editIndex = index;
    this.isEdit = true;
    this.componentMasterForm.get('componentId').setValue(element.componentId);
    this.componentMasterForm.get('subscriberName').setValue(this.dataService.subsrciberDetails.subscriberName);
    this.componentMasterForm.get('componentProductDrawNumber').setValue(element.componentProductDrawNumber)
    this.componentMasterForm.get('componentProductDrawNumber').disable();
    this.componentMasterForm.get('componentProductName').setValue(element.componentProductName);
    this.componentMasterForm.get('componentProductNumber').setValue(element.componentProductNumber);
    this.componentMasterForm.get('componentProductMeterial').setValue(element.componentProductMeterial);
    this.componentMasterForm.get('componentProductManufacturerUnits').setValue(element.componentProductManufacturerUnits);
    this.componentMasterForm.get('componentProductManufacturerUnits').disable();
    this.componentMasterForm.get('customerNameAddress').setValue(element.customerNameAddress);
    this.componentMasterForm.get('customerNameAddress').disable();
    this.componentMasterForm.get('componentProductNotes').setValue(element.componentProductNotes);
  }

  delete(element: ComponentProductMaster) {
    this.commonService.deleteComponentProductMaster(element.componentId)
    .subscribe((response) => {
      console.log('success');
      this.componentProductMasterList = _.without(this.componentProductMasterList, element);
    },
    (error) => {
      this.commonService.triggerAlerts({message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false});
    });
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
    this.commonService.createComponentProductMaster(this.getRequestObject())
    .subscribe((response) => {
      console.log(response);
      if (response.status === 's') {
        this.componentProductMasterList = response.body;
        this.commonService.triggerAlerts({message: 'Component / Product Saved.', showAlert: true, isSuccess: true});
      } else {
        this.commonService.triggerAlerts({message: 'Drawing Number Exists.', showAlert: true, isSuccess: false});
      }
    },
    (error) => {
      this.commonService.triggerAlerts({message: 'Component / Product Not Saved. Please try again.', showAlert: true, isSuccess: false});
    });
  }

  updateComponentProductMaster() {
    this.commonService.updateComponentProductMaster(this.getRequestObject())
    .subscribe((response) => {
      this.componentProductMasterList = response.body;
      this.commonService.triggerAlerts({message: 'Component / Product Updated.', showAlert: true, isSuccess: true});
    },
    (error) => {
      this.commonService.triggerAlerts({message: 'Component / Product Not Saved. Please try again.', showAlert: true, isSuccess: false});
    });
  }

  getRequestObject() {
    this.componentProductMasterObject.componentId = this.componentMasterForm.get('componentId') ? this.componentMasterForm.get('componentId').value || null  : null;
    this.componentProductMasterObject.subscriberId = 12345;
    this.componentProductMasterObject.componentProductDrawNumber = this.componentMasterForm.get('componentProductDrawNumber').value;
    this.componentProductMasterObject.componentProductName = this.componentMasterForm.get('componentProductName').value;
    this.componentProductMasterObject.componentProductNumber = this.componentMasterForm.get('componentProductNumber').value;
    this.componentProductMasterObject.componentProductMeterial = this.componentMasterForm.get('componentProductMeterial').value;
    this.componentProductMasterObject.componentProductManufacturerUnits = this.componentMasterForm.get('componentProductManufacturerUnits').value;
    this.componentProductMasterObject.customerNameAddress = this.componentMasterForm.get('customerNameAddress').value;
    this.componentProductMasterObject.componentProductNotes = this.componentMasterForm.get('componentProductNotes').value;
    return this.componentProductMasterObject;
  }

  resetForm() {
    this.componentMasterForm.reset();
    this.componentMasterForm.get('subscriberName').setValue(this.dataService.subsrciberDetails.subscriberName);
    this.componentMasterForm.get('subscriberName').disable();
  }
}