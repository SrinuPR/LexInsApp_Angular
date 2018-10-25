import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';
import { CommonService } from 'src/app/services/common.service';
import { WorkJobOrderService } from 'src/app/services/work-order.service';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { MatDialog } from '@angular/material';
import { WorkJobOrderConfirmDialogComponent } from './work-job-order-confirm-dialog.component';
import { WorkJobOrderDialog } from 'src/app/interfaces/work-job-order';

@Component({
  selector: 'app-work-job-order',
  templateUrl: './work-job-order.component.html',
  styleUrls: ['./work-job-order.component.scss']
})

export class WorkJobOrderComponent implements OnInit {
    workJobOrderForm: FormGroup;
    componentDataList: ComponentProductMaster[];
    componentData: ComponentProductMaster;
    customerPOList: string[];

    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public workJobOrderService: WorkJobOrderService,
        public dialog: MatDialog
    ) {
      this.componentDataList = [];
      this.componentData = {};
    }
    ngOnInit() {
        this.workJobOrderService.getComponentData(this.commonService.userDtls.subscriberId)
        .subscribe((response) => {
          this.componentDataList = response.body.componentData;
        });
        this.workJobOrderService.getCustomerPOData(this.commonService.userDtls.subscriberId)
        .subscribe((response) => {
          this.customerPOList = response.body.customerPONumberList;
        });
        this.buildFormControls();
        this.workJobOrderForm.get('subscriberName').disable();
        this.workJobOrderForm.get('workJobOrderDate').disable();
        this.workJobOrderForm.get('lotSizeUnits').disable();
        this.workJobOrderForm.get('manufacturingBatchUnits').disable();
    }

    buildFormControls() {
      this.workJobOrderForm = this.formBuilder.group({
        subscriberName: new FormControl(this.commonService.userDtls.subscriberName),
        productDrawingNumberionTypeID: new FormControl('', [Validators.required]),
        customerPONumber: new FormControl('', [Validators.required]),
        workJobOrderNumber: new FormControl('', [Validators.required]),
        workJobOrderDate: new FormControl('', [Validators.required]),
        lotNumber: new FormControl('', [Validators.required]),
        lotSize: new FormControl('', [Validators.required]),
        lotSizeUnits: new FormControl(this.componentData.componentProductManufacturerUnits, [Validators.required]),
        manufacturingBatchNumber: new FormControl('', [Validators.required]),
        manufacturingBatchSize: new FormControl('', [Validators.required]),
        manufacturingBatchUnits: new FormControl(this.componentData.componentProductManufacturerUnits, [Validators.required]),
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

    selectComponentData() {
      const drawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID').value;
      this.componentData = this.componentDataList.find((data: ComponentProductMaster) => {
        return data.componentProductDrawNumber === drawNumber;
      });
      console.log(this.componentData);
      this.workJobOrderForm.get('lotSizeUnits').setValue(this.componentData.componentProductManufacturerUnits);
      this.workJobOrderForm.get('manufacturingBatchUnits').setValue(this.componentData.componentProductManufacturerUnits);
    }

    openConfirmationDialog(): void {
      const dialogRef = this.dialog.open(WorkJobOrderConfirmDialogComponent, {
        width: '500px',
        data: <WorkJobOrderDialog>{
          workJobOrderNumber: this.workJobOrderForm.get('workJobOrderNumber').value}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (!(<WorkJobOrderDialog>result).workJobOrderAcknwldgmnt) {
          this.workJobOrderForm.get('workJobOrderNumber').setValue(null);
        }
      });
    }
}
