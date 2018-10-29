import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { WorkJobOrderService } from 'src/app/services/work-order.service';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { MatDialog } from '@angular/material';
import { WorkJobOrderConfirmDialogComponent } from './work-job-order-confirm-dialog.component';
import { WorkJobOrderDialog, WorkJobOrder } from 'src/app/interfaces/work-job-order';
import { AlertType } from 'src/app/interfaces/alert';

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
    MATCH_SIZE_EXCEEDS_LOT_SIZE = 'Batch Size exceeds the Lot Size';

    headerTitles = ['Component / Product Drawing Number', 'Customer P.O. Number', 'Wor /Job Order Number',
    'Lot Number', 'Manufacturer Batch Number'];
    workJobOrderList: WorkJobOrder[];
    selectedWorkJobOrder: WorkJobOrder;
    isUpdate = false;

    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public workJobOrderService: WorkJobOrderService,
        public dialog: MatDialog
    ) {
      this.componentDataList = [];
      this.componentData = {};
      this.workJobOrderList = [];
      this.selectedWorkJobOrder = {};
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
        this.getWorkJobOrderList();
        this.workJobOrderForm.get('subscriberName').disable();
        // this.workJobOrderForm.get('workJobOrderDate').disable();
        this.workJobOrderForm.get('lotSizeUnits').disable();
        this.workJobOrderForm.get('manufacturingBatchUnits').disable();
    }

    buildFormControls() {
      this.workJobOrderForm = this.formBuilder.group({
        subscriberName: new FormControl(this.commonService.userDtls.subscriberName),
        productDrawingNumberionTypeID: new FormControl(this.selectedWorkJobOrder.componentProductDrawNumber, [Validators.required]),
        customerPONumber: new FormControl(this.selectedWorkJobOrder.customerPONumber, [Validators.required]),
        workJobOrderNumber: new FormControl(this.selectedWorkJobOrder.workJobOrderNumber, [Validators.required]),
        workJobOrderDate: new FormControl(this.selectedWorkJobOrder.workJobOrderDate, [Validators.required]),
        lotNumber: new FormControl(this.selectedWorkJobOrder.lotNumber, [Validators.required]),
        lotSize: new FormControl(this.selectedWorkJobOrder.lotSize, [Validators.required]),
        lotSizeUnits: new FormControl(this.selectedWorkJobOrder.lotSizeUnits, [Validators.required]),
        manufacturingBatchNumber: new FormControl(this.selectedWorkJobOrder.manufacturingBatchNumber, [Validators.required]),
        manufacturingBatchSize: new FormControl(this.selectedWorkJobOrder.manufacturingBatchSize, [Validators.required]),
        manufacturingBatchUnits: new FormControl(this.selectedWorkJobOrder.manufacturingBatchUnits, [Validators.required]),
        workJobOrderNotes: new FormControl(this.selectedWorkJobOrder.workOrderJobNotes, [Validators.required])
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
          this.workJobOrderForm.get(dialogData.fomControlName).setValue(null);
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
              title: 'WARNING',
              content: this.WORK_JOB_ORDER_VALIDATION_WARNING,
              message: 'I know, adding another Lot or Batch',
              confirm: false,
              fomControlName: 'workJobOrderNumber'
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
              title: 'WARNING',
              content: this.LOT_NUMBER_VALIDATION_WARNING,
              message: 'I know, adding another Batch',
              confirm: false,
              fomControlName: 'lotNumber'
            });
          }
          if (result.lotSize) {
            this.workJobOrderForm.get('lotSize').setValue(result.lotSize);
          }
        }, (error) => {console.log(error); });
      }
    }

    validateLotSize() {
      const productDrawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      const lotSize = this.workJobOrderForm.get('lotSize');
      if (productDrawNumber.valid && customerPO.valid && productDrawNumber.value
        && customerPO.value && lotSize.valid && lotSize.value) {
        this.workJobOrderService.validateLotSize(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.message === this.LOT_SIZE_VALIDATION_FAILED) {
            // logic
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
            // logic
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
            // batch
          }
        }, (error) => {
          console.log(error);
          if (error.error.message === this.MATCH_SIZE_EXCEEDS_LOT_SIZE) {
            this.commonService.displayPopUp({
              message: this.MATCH_SIZE_EXCEEDS_LOT_SIZE,
              type: AlertType.ERROR
            });
            batchSize.setErrors({batchSizeExceeds: true});
          }
        }, () => {
          if (batchSize.valid) {
            console.log('clearing batch size errors');
            batchSize.setErrors(null);
          }
        });
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
        return localDate.getDate() + '/' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear();
      }
    }

    createWorkJobOrder() {
      const newWorkJobOrder = this.mapWorkJobOrder();
      this.workJobOrderService.createWorkJobOrder(newWorkJobOrder).
        subscribe((response) => {
          console.log(response);
          this.selectedWorkJobOrder = {};
          this.workJobOrderList.push(newWorkJobOrder);
          this.commonService.displayPopUp({
            message: response.body.message,
            type: AlertType.INFO
          });
        });
    }

    updateWorkJobOrder() {
      const existingWorkJobOrder = this.mapWorkJobOrder();
      const index = this.workJobOrderList.findIndex((data: WorkJobOrder) => {
        return data.workJobOrderNumber === existingWorkJobOrder.workJobOrderNumber;
      });
      this.workJobOrderList[index] = existingWorkJobOrder;
    }

    editWorkJobOrder(wjOrder: WorkJobOrder) {
      this.selectedWorkJobOrder = wjOrder;
      this.isUpdate = true;
      console.log(this.selectedWorkJobOrder);
      this.buildFormControls();
      console.log(this.workJobOrderForm.get('workJobOrderDate').value);
      this.commonService.clearAlerts();
    }

    deleteWorkJobOrder(wjOrder: WorkJobOrder) {
      this.workJobOrderService.deleteWorkJobOrder(wjOrder.wjOrderId)
        .subscribe((response) => {
          const result = response.body;
          if (result && result.status === 'Success') {
            const index = this.workJobOrderList.findIndex((data: WorkJobOrder) => {
              return data.wjOrderId === wjOrder.wjOrderId;
            });
            this.workJobOrderList.splice(index, 1);
            this.commonService.displayPopUp({
              message: result.message,
              type: AlertType.INFO
            });
          }
        });
    }

    getWorkJobOrderList() {
      this.workJobOrderService.getWorkJobOrderList().subscribe((response) => {
        const result = response.body;
        if (result.status === 'Success') {
          this.workJobOrderList = this.parseDate(result.results);
          console.log(this.workJobOrderList);
        }
      });
    }

    parseDate(list: WorkJobOrder[]): WorkJobOrder[] {
      if (list && list.length) {
        list.forEach((order: WorkJobOrder, index: number) => {
          order.workJobOrderDate = new Date(order.workJobOrderDate).toISOString();
          list[index] = order;
        });
      }
      return list;
    }
}
