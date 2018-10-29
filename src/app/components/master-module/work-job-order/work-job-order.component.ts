import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { WorkJobOrderService } from 'src/app/services/work-order.service';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { MatDialog } from '@angular/material';
import { WorkJobOrderConfirmDialogComponent } from './work-job-order-confirm-dialog.component';
import { WorkJobOrderDialog, WorkJobOrder } from 'src/app/interfaces/work-job-order';

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
    WORK_JOB_ORDER_VALIDATION_WARNING = 'Work/Job Order for the selected P.O. exists';
    LOT_NUMBER_VALIDATION_WARNING = 'Lot Number for selected Work/Job Order Exists';
    MANUFACTURER_BATCH_NUMBER_VALIDATION_FAILED = 'Data exists. Please check Work/Job Order Number or Lot Number or Batch Number';
    LOT_SIZE_VALIDATION_FAILED = 'Lot Size exceeds P.O. Quantity';
    MANUFACTURER_BATCH_SIZE_VALIDATION_FAILED = 'Batch Size exceeds the Lot Size';

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
        // this.workJobOrderForm.get('workJobOrderDate').disable();
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

    openConfirmationDialog(dialogData: WorkJobOrderDialog): void {
      const dialogRef = this.dialog.open(WorkJobOrderConfirmDialogComponent, {
        width: '500px',
        data: dialogData,
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (!(<WorkJobOrderDialog>result).confirm) {
          this.workJobOrderForm.get('workJobOrderNumber').setValue(null);
        }
      });
    }

    validateWorkJobOrderAndCustomerPO() {
      const workNumber = this.workJobOrderForm.get('workJobOrderNumber');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      if (workNumber.valid && customerPO.valid && workNumber.value && customerPO.value) {
        this.workJobOrderService.validateWorkJobOrderAndCustomerPO(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.WORK_JOB_ORDER_VALIDATION_WARNING) {
            this.openConfirmationDialog(<WorkJobOrderDialog>{
              title: this.WORK_JOB_ORDER_VALIDATION_WARNING,
              content: 'Do you want to continue with same Work / Job Order ' + workNumber.value,
              confirm: false
            });
          }
        }, (error) => {console.log(error); });
      }
    }

    validateLotNumber() {
      const workNumber = this.workJobOrderForm.get('workJobOrderNumber');
      const lotNumber = this.workJobOrderForm.get('lotNumber');
      if (workNumber.valid && lotNumber.valid && workNumber.value && lotNumber.value) {
        this.workJobOrderService.validateLotNumber(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.LOT_NUMBER_VALIDATION_WARNING) {
            this.openConfirmationDialog(<WorkJobOrderDialog>{
              title: this.LOT_NUMBER_VALIDATION_WARNING,
              content: 'Do you want to continue with same Lot Number ' + lotNumber.value,
              confirm: false
            });
          }
        }, (error) => {console.log(error); });
      }
    }

    validateLotSize() {
      const productDrawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      if (productDrawNumber.valid && customerPO.valid && productDrawNumber.value && customerPO.value) {
        this.workJobOrderService.validateLotSize(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.LOT_SIZE_VALIDATION_FAILED) {
            this.openConfirmationDialog(<WorkJobOrderDialog>{
              title: this.LOT_SIZE_VALIDATION_FAILED,
              content: 'Do you want to continue with same Lot Size ? ',
              confirm: false
            });
          }
        }, (error) => {console.log(error); });
      }
    }

    validateManufacturerBatchNumber() {
      const lotNumber = this.workJobOrderForm.get('lotNumber');
      const batchNumber = this.workJobOrderForm.get('manufacturingBatchNumber');
      if (lotNumber.valid && batchNumber.valid && lotNumber.value && batchNumber.value) {
        this.workJobOrderService.validateManufacturerBatchNumber(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.MANUFACTURER_BATCH_NUMBER_VALIDATION_FAILED) {
            this.openConfirmationDialog(<WorkJobOrderDialog>{
              title: this.MANUFACTURER_BATCH_NUMBER_VALIDATION_FAILED,
              content: '',
              confirm: false
            });
          }
        }, (error) => {console.log(error); });
      }
    }

    validateManufacturerBatchSize() {
      const productDrawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      const lotNumber = this.workJobOrderForm.get('lotNumber');
      const workNumber = this.workJobOrderForm.get('workJobOrderNumber');
      const batchSize = this.workJobOrderForm.get('manufacturingBatchSize');
      if (productDrawNumber.valid && customerPO.valid && productDrawNumber.value && customerPO.value
        && lotNumber.valid && lotNumber.value && workNumber.valid && workNumber.value && batchSize.valid && batchSize.value) {
        this.workJobOrderService.validateManufacturerBatchSize(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.MANUFACTURER_BATCH_SIZE_VALIDATION_FAILED) {
            this.openConfirmationDialog(<WorkJobOrderDialog>{
              title: this.MANUFACTURER_BATCH_SIZE_VALIDATION_FAILED,
              content: 'Do you want to continue with same Batch Size ?',
              confirm: false
            });
          }
        }, (error) => {console.log(error); });
      }
    }

    mapWorkJobOrder() {
      return <WorkJobOrder>{
        workJobOrderNumber: this.workJobOrderForm.get('workJobOrderNumber').value,
        workJobOrderDate: this.toLocaleDate(this.workJobOrderForm.get('workJobOrderDate').value),
        lotNumber: this.workJobOrderForm.get('lotNumber').value,
        lotSize: Number(this.workJobOrderForm.get('lotSize').value),
        lotSizeUnits: this.workJobOrderForm.get('lotSizeUnits').value,
        manufacturingBatchNumber: this.workJobOrderForm.get('manufacturingBatchNumber').value,
        manufacturingBatchSize: Number(this.workJobOrderForm.get('manufacturingBatchSize').value),
        manufacturingBatchUnits: this.workJobOrderForm.get('manufacturingBatchUnits').value,
        subscriberId: this.commonService.userDtls.subscriberId,
        subscriberName: this.workJobOrderForm.get('subscriberName').value,
        componentProductDrawNumber: this.workJobOrderForm.get('productDrawingNumberionTypeID').value,
        customerPONumber: this.workJobOrderForm.get('customerPONumber').value,
        workOrderJobNotes: this.workJobOrderForm.get('workJobOrderNotes').value
      };
    }

    toLocaleDate(value: string): string {
      if (value) {
        const localDate = new Date(value);
        return localDate.getDate() + '-' + localDate.getMonth() + 1 + '-' + localDate.getFullYear();
      }
    }

    createWorkJobOrder() {
      this.workJobOrderService.createWorkJobOrder(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          this.workJobOrderForm.reset();
        });
    }
}
