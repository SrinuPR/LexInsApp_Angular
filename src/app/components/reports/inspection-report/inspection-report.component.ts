import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkJobOrder } from 'src/app/interfaces/work-job-order';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material';
import { InspectionReportService } from 'src/app/services/inspection-report.service';
import { InspectionReport, InspectionReportDialog } from 'src/app/interfaces/inspection-report';
import { AlertType } from 'src/app/interfaces/alert';
import { WorkJobOrderConfirmDialogComponent } from '../../master-module/work-job-order/work-job-order-confirm-dialog.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LineItem } from 'src/app/interfaces/line-items';

@Component({
    selector: 'app-inspection-report',
    templateUrl: './inspection-report.component.html',
    styleUrls: ['./inspection-report.component.scss']
})

export class InspectionReportComponent implements OnInit {
    InspectionReportForm: FormGroup;
    componentDataList: ComponentProductMaster[];
    tempcomponentDataList: ComponentProductMaster[];
    componentData: ComponentProductMaster;
    customerPOList: string[];
    inspectionTypes: string[];
    inspectionStages: string[];
    inspectionReportList: InspectionReport[];
    componentSelected = false;
    headerTitles = ['Component / Product Drawing Number', 'Customer P.O. Number', 'Wor /Job Order Number',
    'Lot Number', 'Manufacturer Batch Number'];
    workJobOrderList: WorkJobOrder[];
    selectedWorkJobOrder: WorkJobOrder;
    selectedInspectionReport: InspectionReport;
    isUpdate = false;
    resource = 'inspectionreportmaster/';
    inspectionReportNumber = new FormControl('', [Validators.required]);
    ReportTerm$ = this.inspectionReportNumber.valueChanges;
    uniqueReportNum =  this.ReportTerm$.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(id =>
        this.commonService.validateResourceIdentifier(this.resource, id)
        )
    );
    example = this.uniqueReportNum.subscribe((response) => {
      console.log('Entered in debounce loop!');
      const control = this.InspectionReportForm.get('inspectionReportNumber');
      const reportNumExists: boolean = (response.body.message === 'Inspection Report Exists');
      if (!reportNumExists) {
        control.setErrors(null);
      } else {
        control.setErrors({'ReportNumExists': true });
      }
    });
    headerColumns: string[] = [
        'Measurement Name',
        'Base Measure',
        'Base Measure Units',
        'Upper Limit (+ Tolerance)',
        'Lower Limit (- Tolerance)'];
    dataSource: LineItem[] = [];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public inspectionReportService: InspectionReportService,
        public dialog: MatDialog
    ) {
      this.componentDataList = [];
      this.componentData = {};
      this.workJobOrderList = [];
      this.selectedWorkJobOrder = {};
      this.selectedInspectionReport = {};
      this.inspectionTypes = [];
      this.inspectionStages = [];
      this.tempcomponentDataList = [];
      this.inspectionReportList = [];
    }
    ngOnInit() {
        this.inspectionReportService.getComponentData(this.commonService.userDtls.subscriberId)
        .subscribe((response) => {
          this.componentDataList = JSON.parse(JSON.stringify(response.body.result));
        });

        this.buildFormControls();
        this.InspectionReportForm.addControl('inspectionReportNumber', this.inspectionReportNumber);
       // this.getWorkJobOrderList();
        this.InspectionReportForm.get('subscriberName').disable();
        this.InspectionReportForm.get('productDrawingName').disable();
        this.InspectionReportForm.get('lotNumber').disable();
        this.InspectionReportForm.get('lotSize').disable();
        this.InspectionReportForm.get('manufacturingBatchNumber').disable();
        this.InspectionReportForm.get('manufacturingBatchSize').disable();
        this.InspectionReportForm.get('customerPONumber').disable();
        this.InspectionReportForm.get('customerPoQuantity').disable();
        this.InspectionReportForm.get('customerPoDate').disable();
    }

    buildFormControls() {
      this.InspectionReportForm = this.formBuilder.group({
        subscriberName: new FormControl({value: this.commonService.userDtls.subscriberName, disabled: this.isUpdate}),
        productDrawingNumberionTypeID: new FormControl(this.selectedInspectionReport.componentProductDrawNumber, [Validators.required]),
        productDrawingName: new FormControl(this.selectedInspectionReport.componentProdcuctName, [Validators.required]),
        workJobOrderNumber: new FormControl( this.selectedInspectionReport.workJobOrderNumber, [Validators.required]),
        lotNumber: new FormControl({value: this.selectedInspectionReport.lotNumber, disabled: this.isUpdate}, [Validators.required]),
        lotSize: new FormControl(this.selectedInspectionReport.lotSize, [Validators.required]),
        inspectionType: new FormControl(this.selectedInspectionReport.inspectionTypeId, [Validators.required]),
        inspectionStage: new FormControl(this.selectedInspectionReport.inspectionStageId, [Validators.required]),
        manufacturingBatchNumber: new FormControl(this.selectedInspectionReport.manufacturingBatchNumber, [Validators.required]),
        manufacturingBatchSize: new FormControl(this.selectedInspectionReport.manufacturingBatchSize, [Validators.required]),
        customerPONumber: new FormControl(this.selectedInspectionReport.customerPONumber, [Validators.required]),
        customerPoQuantity: new FormControl(this.selectedInspectionReport.customerPoQuantity, [Validators.required]),
        customerPoDate: new FormControl(this.selectedInspectionReport.customerPoDate, [Validators.required]),
      });
    }

    selectComponentData() {
        const drawNumber = this.InspectionReportForm.get('productDrawingNumberionTypeID').value;
        this.componentData = this.componentDataList.find((data: ComponentProductMaster) => {
          return data.componentProductDrawNumber === drawNumber;
        });
        this.InspectionReportForm.get('productDrawingName').setValue(this.componentData.componentProductName);
        this.inspectionReportService.getWorkJobOrderByPCNum(drawNumber)
        .subscribe((response) => {
          this.workJobOrderList = response.body.results;
        },
        (error) => {console.log('error:' + error);
        }
        );
        this.inspectionReportService.getInspectionTypesOfComponent(drawNumber)
        .subscribe((response) => {
            console.log('response.inspectionTypeNam:' + response);
            this.inspectionTypes = response.body.inspTypeList;
            this.inspectionStages = response.body.inspStageList;
        });
        this.inspectionReportService.getInspectionMeasurementsForPid(drawNumber)
        .subscribe((response) => {
            console.log('response.Line Items 2:' + response[0].lowerLimit);
            response.forEach((lItem: LineItem, index: number) => {
                console.log('lItem:' + lItem.lowerLimit);
                this.dataSource.push(lItem);
                console.log('this.dataSource length:' + this.dataSource.length);
              });
        });
            this.componentSelected = true;
      }
      selectWorkOrJobOrder() {
        const drawNumber = this.InspectionReportForm.get('workJobOrderNumber').value;
        this.selectedWorkJobOrder = this.workJobOrderList.find((data: WorkJobOrder) => {
            return data.wjOrderId === drawNumber;
          });
          this.InspectionReportForm.get('lotNumber').setValue(this.selectedWorkJobOrder.lotNumber);
          this.InspectionReportForm.get('lotSize').setValue(this.selectedWorkJobOrder.lotSize);
          this.InspectionReportForm.get('manufacturingBatchNumber').setValue(this.selectedWorkJobOrder.manufacturingBatchNumber);
          this.InspectionReportForm.get('manufacturingBatchSize').setValue(this.selectedWorkJobOrder.manufacturingBatchSize);
          this.InspectionReportForm.get('customerPONumber').setValue(this.selectedWorkJobOrder.customerPONumber);
          this.InspectionReportForm.get('customerPoDate').setValue(new Date(this.selectedWorkJobOrder.customerPODate).toISOString());
          this.InspectionReportForm.get('customerPoQuantity').setValue(this.selectedWorkJobOrder.customerPOQuantity);
      }

      displayErrorMessages(field: string) {
        const control = this.InspectionReportForm.get(field);
        if (control) {
          return (control.touched && control.invalid);
        }
        return false;
      }

      mapInspectionReport() {
        return <InspectionReport>{
          userId: this.commonService.userDtls.userId,
          inspReportNumber: this.InspectionReportForm.get('inspectionReportNumber').value,
          inspectionTypeId: this.InspectionReportForm.get('inspectionType').value,
          componentProdcuctName: this.InspectionReportForm.get('productDrawingName').value,
          inspectionStageId: this.InspectionReportForm.get('inspectionStage').value,
          workJobOrderId: this.InspectionReportForm.get('workJobOrderNumber').value,
          lotNumber: this.InspectionReportForm.get('lotNumber').value,
          lotSize: Number(this.InspectionReportForm.get('lotSize').value),
          manufacturingBatchNumber: this.InspectionReportForm.get('manufacturingBatchNumber').value,
          manufacturingBatchSize: Number(this.InspectionReportForm.get('manufacturingBatchSize').value),
          subscriberId: this.commonService.userDtls.subscriberId,
          subscriberName: this.InspectionReportForm.get('subscriberName').value,
          componentProductDrawNumber: this.InspectionReportForm.get('productDrawingNumberionTypeID').value,
          customerPoNumber: this.InspectionReportForm.get('customerPONumber').value,
          customerPoDate: this.toLocaleDate(this.InspectionReportForm.get('customerPoQuantity').value),
          customerPoQuantity: this.InspectionReportForm.get('customerPoQuantity').value,
          partIdentifications: [],
          inspectionDate: null
        };
      }

      createInspectionReport() {
        const newInspectionReport = this.mapInspectionReport();
        const workJobOrder = this.workJobOrderList.find((order: WorkJobOrder) => {
          return order.wjOrderId === newInspectionReport.workJobOrderId;
        });
        newInspectionReport.workJobOrderNumber = workJobOrder.workJobOrderNumber;
        this.inspectionReportService.createInspectionReport(newInspectionReport).
          subscribe((response) => {
            console.log(response);
            this.selectedInspectionReport = {};
            this.inspectionReportList.push(newInspectionReport);
            this.commonService.displayPopUp({
              message: response.body.message,
              type: AlertType.INFO
            });
          }, (error) => {
            if (error && error.error) {
              this.commonService.displayPopUp({
                message: error.error.message,
                type: AlertType.ERROR
              });
            }
          });
      }
      openConfirmationDialog(dialogData: InspectionReportDialog): void {
        const dialogRef = this.dialog.open(WorkJobOrderConfirmDialogComponent, {
          width: '500px',
          data: dialogData,
          disableClose: true,
          hasBackdrop: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (dialogData.enableControlsOrExit) {
            if (!(<InspectionReportDialog>result).confirm) {
              this.InspectionReportForm.get(dialogData.fomControlName).enable();
            } else {
              console.log('Exit the screen');
              this.router.navigate(['/dashboard']);
            }
          } else {
            if (!(<InspectionReportDialog>result).confirm) {
              this.InspectionReportForm.get(dialogData.fomControlName).setValue(null);
            }
          }
        });
      }

      toLocaleDate(value: string): string {
        if (value) {
          const localDate = new Date(value);
          return localDate.getDate() + '/' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear() ;
        }
      }

      parseDate(list: InspectionReport[]): InspectionReport[] {
        if (list && list.length) {
          list.forEach((order: InspectionReport, index: number) => {
            order.customerPoDate = new Date(order.customerPoDate).toISOString();
            list[index] = order;
          });
        }
        return list;
      }
}
