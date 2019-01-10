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
    @ViewChild('wjoForm') wjoForm;
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
    FULL_WORK_JOB_ORDER_QUANTITY_PRODUCED = 'Full Work / Job Order Quantity Produced. Cannot change the Work /Job Order';
    FULL_LOT_SIZE_PRODUCED = 'Full Lot Size Produced for this Lot Number';
    FULL_BATCH_SIZE_PRODUCED = 'Full Batch Size Produced for this Batch Number';
    OOPS_REENTER = 'Oops, I will reenter';

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
    }

    buildFormControls() {
      this.workJobOrderForm = this.formBuilder.group({
        subscriberName: new FormControl({value: this.commonService.userDtls.subscriberName, disabled: this.isUpdate}),
        productDrawingNumberionTypeID: new FormControl(this.selectedWorkJobOrder.componentProductDrawNumber, [Validators.required]),
        customerPONumber: new FormControl(this.selectedWorkJobOrder.customerPONumber, [Validators.required]),
        workJobOrderNumber: new FormControl({value: this.selectedWorkJobOrder.workJobOrderNumber,
          disabled: this.isUpdate}, [Validators.required]),
        workJobOrderDate: new FormControl({value: this.selectedWorkJobOrder.workJobOrderDate
          ? new Date(Date.parse(this.selectedWorkJobOrder.workJobOrderDate)) : this.selectedWorkJobOrder.workJobOrderDate,
           disabled: this.isUpdate}, [Validators.required]),
        lotNumber: new FormControl({value: this.selectedWorkJobOrder.lotNumber, disabled: this.isUpdate}, [Validators.required]),
        lotSize: new FormControl(this.selectedWorkJobOrder.lotSize, [Validators.required]),
        lotSizeUnits: new FormControl({value: this.selectedWorkJobOrder.lotSizeUnits, disabled: this.isUpdate}, [Validators.required]),
        manufacturingBatchNumber: new FormControl({value: this.selectedWorkJobOrder.manufacturingBatchNumber,
           disabled: this.isUpdate}, [Validators.required]),
        manufacturingBatchSize: new FormControl(this.selectedWorkJobOrder.manufacturingBatchSize, [Validators.required]),
        manufacturingBatchUnits: new FormControl({value: this.selectedWorkJobOrder.manufacturingBatchUnits,
           disabled: this.isUpdate}, [Validators.required]),
        workJobOrderNotes: new FormControl(this.selectedWorkJobOrder.workOrderJobNotes, []),
        wjOrderId: new FormControl(this.selectedWorkJobOrder.wjOrderId, [])
      });
      this.workJobOrderForm.get('subscriberName').disable();
      this.workJobOrderForm.get('lotSizeUnits').disable();
      this.workJobOrderForm.get('manufacturingBatchUnits').disable();
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
        if (dialogData.enableControlsOrExit) {
          if (!(<WorkJobOrderDialog>result).confirm) {
            this.workJobOrderForm.get(dialogData.fomControlName).enable();
          } else {
            console.log('Exit the screen');
            this.router.navigate(['/dashboard']);
          }
        } else {
          if (!(<WorkJobOrderDialog>result).confirm) {
            this.workJobOrderForm.get(dialogData.fomControlName).setValue(null);
          }
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
              fomControlName: 'workJobOrderNumber',
              actionControlText: this.OOPS_REENTER,
              enableControlsOrExit: false,
              type: AlertType.WARNING
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
              fomControlName: 'lotNumber',
              actionControlText: this.OOPS_REENTER,
              enableControlsOrExit: false,
              type: AlertType.WARNING
            });
          }
          if (result.lotSize) {
            this.workJobOrderForm.get('lotSize').setValue(result.lotSize);
          }
        }, (error) => {
          console.log(error);
          if (error.error && error.error.message) {
            this.commonService.displayPopUp({
              message: error.error.message,
              type: AlertType.ERROR
            });
          }
        });
      }
    }

    validateLotSize() {
      const productDrawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      const lotSize = this.workJobOrderForm.get('lotSize');
      if (!productDrawNumber.invalid && !customerPO.invalid && productDrawNumber.value
        && customerPO.value && !lotSize.invalid && lotSize.value) {
        this.workJobOrderService.validateLotSize(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
          if (error.error && error.error.message) {
            if (error.error.message === this.FULL_BATCH_SIZE_PRODUCED) {
              this.openConfirmationDialog(<WorkJobOrderDialog>{
                title: 'ERROR',
                content: this.FULL_BATCH_SIZE_PRODUCED,
                message: 'Other Lot Number',
                confirm: false,
                fomControlName: 'lotNumber',
                actionControlText: 'Exit',
                enableControlsOrExit: true,
                type: AlertType.ERROR
              });
            } else {
              this.commonService.displayPopUp({
                message: error.error.message,
                type: AlertType.ERROR
              });
            }
          }
        });
      }
    }

    validateManufacturerBatchNumber() {
      const lotNumber = this.workJobOrderForm.get('lotNumber');
      const batchNumber = this.workJobOrderForm.get('manufacturingBatchNumber');
      if (lotNumber.valid && batchNumber.valid && lotNumber.value && batchNumber.value) {
        this.workJobOrderService.validateManufacturerBatchNumber(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
          if (error.error && error.error.message) {
            this.commonService.displayPopUp({
              message: error.error.message,
              type: AlertType.ERROR
            });
          }
        });
      }
    }

    validateManufacturerBatchSize() {
      const productDrawNumber = this.workJobOrderForm.get('productDrawingNumberionTypeID');
      const customerPO = this.workJobOrderForm.get('customerPONumber');
      const lotNumber = this.workJobOrderForm.get('lotNumber');
      const workNumber = this.workJobOrderForm.get('workJobOrderNumber');
      const batchSize = this.workJobOrderForm.get('manufacturingBatchSize');
      if (!productDrawNumber.invalid && !customerPO.invalid && productDrawNumber.value && customerPO.value
        && !lotNumber.invalid && lotNumber.value && !workNumber.invalid && workNumber.value && batchSize.valid && batchSize.value) {
        this.workJobOrderService.validateManufacturerBatchSize(this.mapWorkJobOrder()).
        subscribe((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
          if (error.error && error.error.message) {
            if (error.error.message === this.FULL_BATCH_SIZE_PRODUCED) {
              this.openConfirmationDialog(<WorkJobOrderDialog>{
                title: 'ERROR',
                content: this.FULL_BATCH_SIZE_PRODUCED,
                message: 'Other Batch Number',
                confirm: false,
                fomControlName: 'workJobOrderNumber',
                actionControlText: 'Exit',
                enableControlsOrExit: true,
                type: AlertType.ERROR
              });
            } else {
              this.commonService.displayPopUp({
                message: error.error.message,
                type: AlertType.ERROR
              });
            }
            batchSize.setErrors({batchSizeExceeds: true});
          }
        }, () => {
          if (batchSize.valid) {
            batchSize.setErrors(null);
          }
        });
      }
    }

    mapWorkJobOrder() {
      return <WorkJobOrder>{
        wjOrderId: this.workJobOrderForm.get('workJobOrderNumber').value,
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
          this.resetForm();
          this.commonService.displayPopUp({
            message: response.body.message,
            type: AlertType.INFO
          });
        }, (error) => {
          if (error && error.error) {
            this.resetForm();
            this.commonService.displayPopUp({
              message: error.error.message,
              type: AlertType.ERROR
            });
          }
        });
    }

    updateWorkJobOrder() {
      const existingWorkJobOrder = this.mapWorkJobOrder();
      this.workJobOrderService.updateWorkJobOrder(existingWorkJobOrder).
        subscribe((response) => {
          const index = this.workJobOrderList.findIndex((data: WorkJobOrder) => {
            return data.workJobOrderNumber === existingWorkJobOrder.workJobOrderNumber;
          });
          this.workJobOrderList[index] = existingWorkJobOrder;
          this.isUpdate = false;
          this.selectedWorkJobOrder = {};
          this.resetForm();
          this.commonService.displayPopUp({
            message: response.body.message,
            type: AlertType.INFO
          });
        }, (error) => {
          this.resetForm();
          if (error && error.error) {
            this.commonService.displayPopUp({
              message: error.error.message,
              type: AlertType.ERROR
            });
          }
        });
    }

    editWorkJobOrder(wjOrder: WorkJobOrder) {
      console.log('wjorder', wjOrder);
      this.selectedWorkJobOrder = wjOrder;
      this.isUpdate = true;
      const dateArray = (this.selectedWorkJobOrder.workJobOrderDate).split('/');
      this.selectedWorkJobOrder.workJobOrderDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
      this.buildFormControls();
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

    resetForm() {
      this.wjoForm.resetForm();
      this.workJobOrderForm.reset();
      this.workJobOrderForm.get('subscriberName').setValue(this.commonService.userDtls.subscriberName);
      this.workJobOrderForm.get('subscriberName').disable();
      this.workJobOrderForm.get('lotSizeUnits').disable();
      this.workJobOrderForm.get('manufacturingBatchUnits').disable();
    }
}
