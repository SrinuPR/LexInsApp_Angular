import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionType } from 'src/app/interfaces/inspection-type';
import { InspectionStage } from 'src/app/interfaces/inspection-stage';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { InspectionMeasurementService } from 'src/app/services/inspection-measurement.service';
import { CommonService } from 'src/app/services/common.service';
import { InspectionReport } from 'src/app/interfaces/inspection-report';
import { InspectionMeasurement, InspectionMeasurementDialog } from 'src/app/interfaces/inspection-measurement';
import { Facility } from 'src/app/interfaces/facility';
import { Shift } from '../shift/shift.component';
import { LineItem } from 'src/app/interfaces/line-items';
import { InspectionReportService } from 'src/app/services/inspection-report.service';
import { DISABLED } from '@angular/forms/src/model';
import { WorkJobOrderConfirmDialogComponent } from '../work-job-order/work-job-order-confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { AlertType } from 'src/app/interfaces/alert';
import { PartIdentificationData } from 'src/app/interfaces/part-identification';
import { forEach } from '@angular/router/src/utils/collection';

class Measurement {
  constructor(public mName: string ,
    public  mValue: string) {
    }
}

class PartList {
  constructor(public partNum: number, public measurementList: Measurement[]) {
  }
}

class InspectionMetrics {
  constructor(public BM: string, public LL: string , public UL: string) {

  }
}

class Range {
  constructor(public llValue: number, public ulValue: number) {

  }
}

class FormControlMetadata {
  constructor(
       public checkboxName: string,
       public checkboxLabel: string,
       public associateControlName: string,
       public associateControlLabel: string,
       public associateControlType: string,
       public associateControlData: Array<Measurement>) { }
}

@Component({
  selector: 'app-inspection-measurements',
  templateUrl: './inspection-measurements.component.html',
  styleUrls: ['./inspection-measurements.component.css']
})
export class InspectionMeasurementsComponent implements OnInit {
  @ViewChild('formDirective') formDirective;
    inspectionTypeList: InspectionType[];
    inspectionStageList: InspectionStage[];
    componentDataList: ComponentProductMaster[];
    inpectionReportList: InspectionReport[];
    selectedReportNum: InspectionReport = {};
    facilities: Facility[];
    shifts: Shift[];
    inspectionsForm: FormGroup;
    measurementDataHeaders = ['Desired', 'Actual', 'Deviation'];
    measurementNamesForm: FormArray = new FormArray([]);
    measurementsControlMetada: Array<FormControlMetadata> = [];
    partNumberSw = false;
    selectedPartNum: number;
    selectedLineItem: PartIdentificationData;
    upperLimitRange: Range;
    lowerLimitRange: Range;
    overAllRange: Range;
    measurementStatus: string = null;
    enablemeasurementValue = 'Y';
    partIdentificationList: PartIdentificationData[] = [];
    measurementId: number;
    inspectionMetricsList = [
      new InspectionMetrics('Desired_BM', 'Desired_LL', 'Desired_UL'),
      new InspectionMetrics('Actual_BM', 'Actual_LL', 'Actual_UL'),
      new InspectionMetrics('Deviation_BM', 'Deviation_LL', 'Deviation_UL')
    ];
    measurementNamesList: Measurement[] = [];
    selectedMeasurementName?: string;
    baseMeasure?: number;
    baseMeasureUnits?: number;
    lowerLimit?: number;
    upperLimit?: number;
    lineItemList: PartIdentificationData[] = [];
    // lineItemList: LineItem[] = [
    //   {measurementName: 'length', baseMeasure: 24.0000 , baseMeasureUnits: 2, lowerLimit: 0.0000, upperLimit: 0.0024 },
    //   {measurementName: 'breadth', baseMeasure: 24.0000 , baseMeasureUnits: 2, lowerLimit: 0.0022, upperLimit: 0.0000 }
    // ];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public inspectionService: InspectionMeasurementService,
        public commonService: CommonService,
        public inspectionReportService: InspectionReportService,
       public dialog: MatDialog
    ) { }
    ngOnInit() {
        this.buildFormControls();
        this.inspectionService.getCompDrawNumList(this.commonService.userDtls.subscriberId)
        .subscribe((response) => {
          const unique = new Set<number>();
          this.componentDataList = [];
          response.body.componentData.forEach((component: ComponentProductMaster) => {
            if (!unique.has(component.componentId)) {
              unique.add(component.componentId);
              this.componentDataList.push(component);
            }
          });
          this.facilities = response.body.facilityData;
          this.shifts = response.body.shiftData;
          this.inpectionReportList = response.body.reportData;
        });
      }

    buildFormControls() {
        this.inspectionsForm = this.formBuilder.group({
            componentProductDrawingNumber: new FormControl('', [Validators.required]),
            inspectionReportNumber: new FormControl('', [Validators.required]),
            machineID: new FormControl('', [Validators.required]),
            shiftID: new FormControl('', [Validators.required]),
            shiftName: new FormControl('', [Validators.required]),
            machineName: new FormControl('', [Validators.required]),
            manBatchSize: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            inspectionType: new FormControl('', [Validators.required]),
            inspectionStage: new FormControl('', [Validators.required]),
            inspectionDate: new FormControl('', [Validators.required]),
            partIdentificationNumber: new FormControl('', [Validators.required]),
            mNames: this.formBuilder.array([{}]),
            measuredValue: new FormControl(''),
            status: new FormControl(''),
            partStatus: new FormControl(''),
            metrics: this.formBuilder.array([{}]),
            Desired_BM: new FormControl(''),
            Desired_LL: new FormControl(''),
            Desired_UL: new FormControl(''),
            Actual_BM: new FormControl(''),
            Actual_LL: new FormControl(''),
            Actual_UL: new FormControl(''),
            Deviation_BM: new FormControl(''),
            Deviation_LL: new FormControl(''),
            Deviation_UL: new FormControl(''),
            producedQuantity: new FormControl('', [Validators.required]),
            inspectedQuantity: new FormControl('')
        });
        this.inspectionsForm.get('machineName').disable();
        this.inspectionsForm.get('shiftName').disable();
      }

      buildMeasurementsData(reportNum: string) {
        if (this.inpectionReportList != null ) {
          console.log(this.selectedReportNum.lineItemData);
          this.lineItemList = this.selectedReportNum.lineItemData;
          console.log('this.lineItemList.length:' + this.lineItemList.length);
        }
        if (this.lineItemList != null) {
          this.lineItemList.forEach(i => {
            console.log('measurement name : ' + i.measurementName);
            this.measurementNamesList.push(new Measurement(i.measurementName, i.measuredValue + ''));
          });
          console.log('i.measurementNamesList size:' + this.measurementNamesList[0].mName);
        }
        this.populateMeasurements();
      }

    measurements(): FormArray {
      return this.inspectionsForm.get('mNames') as FormArray;
    }

    populateMeasurements() {
      // get the property
      this.measurementNamesForm = this.measurements();
      // clear
      this.measurementNamesForm.removeAt(0);
      let p: Measurement;
      // loop through the list and create the formarray metadata
      for (p of this.measurementNamesList) {
        const control = new FormControlMetadata(null, null, null, null, null, null );
        const group = this.formBuilder.group({});
        // create the checkbox and other form element metadata
        control.checkboxName = p.mName;
        control.checkboxLabel = p.mName;
        control.associateControlName = p.mValue;
        control.associateControlLabel = p.mValue;
        control.associateControlType = 'textbox';
        console.log('i.measurementName:' + p.mName);
        // control.associateControlData = p.mName;
        // store in array, use by html to loop through
        this.measurementsControlMetada.push(control);
        // form contol
        const checkBoxControl = this.formBuilder.control('');
        const associateControl = this.formBuilder.control({ value: p.mValue, disabled: true });
        // add to form group [key, control]
        group.addControl(p.mName, checkBoxControl);
        group.addControl(p.mValue, associateControl);
        this.measurementNamesForm.push(group);
      }
    }
    displayErrorMessages (field: string) {
        const control = this.inspectionsForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    onProdDrawNumberChange() {
      this.inspectionService.getInspectionReportList(this.inspectionsForm.get('componentProductDrawingNumber').value)
        .subscribe((response) => {
          console.log(response.body.reportData);
          this.inpectionReportList = response.body.reportData;
        });
    }

    onInspectionReportNumberChange() {
      const rNumber = this.inspectionsForm.get('inspectionReportNumber').value;
      this.selectedReportNum = this.inpectionReportList.find(i => i.inspReportNumber === rNumber);
      this.inspectionsForm.get('manBatchSize').setValue(this.selectedReportNum.manufacturingBatchSize);
      this.inspectionsForm.get('userName').setValue(this.commonService.userDtls.userId);
      this.inspectionsForm.get('inspectionType').setValue(this.selectedReportNum.inspectionTypeId);
      this.inspectionsForm.get('inspectionStage').setValue(this.selectedReportNum.inspectionStageId);
      this.inspectionsForm.get('inspectionDate').setValue(this.selectedReportNum.inspectionDate);
      this.lineItemList = this.selectedReportNum.lineItemData;
      console.log('on report select :' + this.lineItemList);
      this.buildMeasurementsData(rNumber);
    }

    mapInspectionMeasurement() {
      return <InspectionMeasurement>{
            inspectionMeasurementId: this.measurementId,
            userId: this.commonService.userDtls.userId,
            subscriberId: this.commonService.userDtls.subscriberId,
            subscriberName: this.commonService.userDtls.subscriberName,
            compProductDrawNum: this.inspectionsForm.get('componentProductDrawingNumber').value,
            inspectionReportNumber: this.inspectionsForm.get('inspectionReportNumber').value,
            shiftID: this.inspectionsForm.get('shiftID').value,
            shiftName: this.inspectionsForm.get('shiftName').value,
            facilityMachineNumber: this.inspectionsForm.get('machineID').value,
            facilityMachineName: this.inspectionsForm.get('machineName').value,
            manufacturingBatchSize: this.inspectionsForm.get('manBatchSize').value,
            userName: this.commonService.userDtls.userName,
            inspectionType: this.inspectionsForm.get('inspectionType').value,
            inspectionStage: this.inspectionsForm.get('inspectionStage').value,
            inspectionDate: this.toLocaleDate(this.inspectionsForm.get('inspectionDate').value),
            partIdentificationNumber: this.inspectionsForm.get('partIdentificationNumber').value,
            measuredValue:
            this.inspectionsForm.get('measuredValue').value !== '' ? this.inspectionsForm.get('measuredValue').value : 0 ,
            status: this.inspectionsForm.get('status').value,
            partStatus: this.inspectionsForm.get('partStatus').value,
            partIdentifications: this.partIdentificationList,
            producedQuantity:
            this.inspectionsForm.get('producedQuantity').value !== '' ? this.inspectionsForm.get('producedQuantity').value : 0,
            inspectedQuantity:
            this.inspectionsForm.get('inspectedQuantity').value !== '' ? this.inspectionsForm.get('inspectedQuantity').value : 0,
            customerPODate: this.selectedReportNum.customerPoDate,
            workOrderId: this.selectedReportNum.workJobOrderId,
            workJobOrderNumber: this.selectedReportNum.workJobOrderNumber,
            lotSize: this.selectedReportNum.lotSize,
            lotNumber: this.selectedReportNum.lotNumber,
            manufacturingBatchNumber: this.selectedReportNum.manufacturingBatchNumber,
            customerNameAddress: this.selectedReportNum.customerNameAddress

      };
    }

    onFacilityNumberSelection() {
      const facilityNumber = this.inspectionsForm.get('machineID').value;
      const facility = this.facilities.find((fac: Facility) => {
        return fac.facilityId === facilityNumber;
      });
      this.inspectionsForm.get('machineName').setValue(facility.facilityName);
    }

    toLocaleDate(value: string): string {
      if (value) {
        const localDate = new Date(value);
        return localDate.getDate() + '/' + (localDate.getMonth() + 1) + '/' + localDate.getFullYear() ;
      }
    }
    onShiftIDSelection() {
      const shiftID = this.inspectionsForm.get('shiftID').value;
      const shift = this.shifts.find((shft: Shift) => {
        return shft.shiftId === shiftID;
      });
      this.inspectionsForm.get('shiftName').setValue(shift.shiftName);
    }

    onReportSelect() {
            const reportNum = this.inspectionsForm.get('inspectionReportNumber').value;
        //     this.inspectionReportService.getInspectionMeasurementsForPid(reportNum)
        // .subscribe((response) => {
        //     console.log('response.Line Items 2:' + response[0].lowerLimit);
        //     this.lineItemList = response;
        // });
    }
    partNumberSwitch() {
      const existingReport: InspectionReport = this.selectedReportNum;
      console.log('produceQunatity: ' + this.inspectionsForm.get('producedQuantity').value);
      this.selectedPartNum = this.inspectionsForm.get('partIdentificationNumber').value;
      if (this.selectedPartNum > 0 ) {
        this.inspectionReportService.addPartForMeasurements(this.selectedPartNum, this.mapInspectionMeasurement()).subscribe(
          (response) => {
            this.measurementId = response.inspectionMeasurementId;
            this.lineItemList = response.partIdentifications;
          }
        );
        this.partNumberSw = true;
        // if (existingReport != null) {
        //   this.lineItemList = existingReport.lineItemData;
        // }
        if (this.lineItemList != null && this.lineItemList.length > 0 ) {
          this.lineItemList.forEach((measurement) => {
            if (measurement.status != null) {
              this.partIdentificationList.push(measurement);
            }
          });
        }
      }
    }

    checkedEvent(e) {
      this.clearMeasurementsData();
           this.enablemeasurementValue = 'N';
           this.selectedMeasurementName = e.value;
           console.log('after selection of measurement:' + this.selectedMeasurementName );
            if (this.selectedMeasurementName !== null) {
              this.selectedLineItem =  this.lineItemList.find(i => i.measurementName === this.selectedMeasurementName ) ; 
              console.log('this.lineItemList[0].name' + this.lineItemList[0].measurementName);
            }
            console.log('selected line item:' + this.selectedLineItem.measurementName
            + ' actual Measure:' + this.selectedLineItem.actualBaseMeasure);
            this.calcOverAllMeasurement();
    }

  calcOverAllMeasurement() {
    let measuredVal = this.inspectionsForm.get('measuredValue').value;
    const checkLineitemWIthPIN =  this.partIdentificationList.find
    (i => i.partIdentificationNumber === this.selectedPartNum && i.measurementName === this.selectedMeasurementName ) ;
    if (checkLineitemWIthPIN != null ) {
      console.log('entered through change event');
      measuredVal = checkLineitemWIthPIN.actualBaseMeasure;
      this.inspectionsForm.get('measuredValue').setValue(measuredVal);
    }
    if (measuredVal != null && measuredVal > 0) {
      this.calcOverallRange(this.selectedLineItem , measuredVal);
      const actualMeasure = this.getActualMeasureValue(measuredVal);
      const actualUL =
      measuredVal > this.selectedLineItem.actualBaseMeasure ? (actualMeasure - this.selectedLineItem.actualBaseMeasure) :
      ( this.selectedLineItem.actualBaseMeasure - actualMeasure);
      const actualLL =
      measuredVal < this.selectedLineItem.actualBaseMeasure ? (this.selectedLineItem.actualBaseMeasure - actualMeasure ) :
      ( actualMeasure - this.selectedLineItem.actualBaseMeasure);
      this.inspectionsForm.get('Desired_BM').setValue(this.selectedLineItem.actualBaseMeasure);
      this.inspectionsForm.get('Desired_LL').setValue(this.selectedLineItem.actualLowerLimit);
      this.inspectionsForm.get('Desired_UL').setValue(this.selectedLineItem.actualUpperLimit);
      this.inspectionsForm.get('Actual_BM').setValue(actualMeasure);
      this.inspectionsForm.get('Actual_LL').setValue(actualLL);
      this.inspectionsForm.get('Actual_UL').setValue(actualUL);
      this.inspectionsForm.get('Deviation_BM').setValue(actualMeasure - this.selectedLineItem.actualBaseMeasure);
      this.inspectionsForm.get('Deviation_LL').setValue(actualLL - this.selectedLineItem.actualLowerLimit);
      this.inspectionsForm.get('Deviation_UL').setValue(actualUL - this.selectedLineItem.actualUpperLimit);
    }
  }
  calcOverallRange(lineItem: PartIdentificationData, desiredVal: number) {
      this.upperLimitRange = new Range(lineItem.actualBaseMeasure + 0.0001 , lineItem.actualBaseMeasure + lineItem.actualUpperLimit);
      this.lowerLimitRange = new Range(lineItem.actualBaseMeasure - lineItem.actualLowerLimit , lineItem.actualBaseMeasure - 0.0001);
      this.overAllRange = new Range(this.lowerLimitRange.llValue , this.upperLimitRange.ulValue);
      console.log('desiredVal' + desiredVal + 'this.overAllRange.llValue' + this.overAllRange.llValue
      + 'this.overAllRange.ulValue: ' + this.overAllRange.ulValue);
      this.measurementStatus = (desiredVal > this.overAllRange.llValue && desiredVal < this.overAllRange.ulValue) ? 'ACCEPT' : 'REJECT';
      if (this.measurementStatus === 'REJECT') {
        // this.commonService.displayPopUp({
        //   message: 'The above value falls outside the range',
        //   type: AlertType.ERROR
        // });

        this.openConfirmationDialog(<InspectionMeasurementDialog>{
          title: 'WARNING',
          content: 'The given value falls outside the range',
          message: 'Accept',
          confirm: false,
          fomControlName: 'measuredValue',
          actionControlText: 'Reset',
          enableControlsOrExit: false,
          type: AlertType.WARNING
        });
      }
  }
  getActualMeasureValue(desiredVal: number) {
    if  (desiredVal >= this.upperLimitRange.llValue && desiredVal <= this.upperLimitRange.ulValue) {
      return Math.floor(desiredVal);
    }
      return Math.ceil(desiredVal);
  }

  openConfirmationDialog(dialogData: InspectionMeasurementDialog): void {
    const dialogRef = this.dialog.open(WorkJobOrderConfirmDialogComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true,
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
        if (!(<InspectionMeasurementDialog>result).confirm) {
          this.clearMeasurementsData();
        }
    });
  }

  onSaveMeasurement() {

    if (this.selectedPartNum != null) {
      const formattedMValue = this.inspectionsForm.get('measuredValue').value.toFixed(4);
      const tempPartNum = {
        partVerifId: null,
        measurementName: this.selectedMeasurementName,
        measuredValue:  formattedMValue ,
        actualBaseMeasure: this.inspectionsForm.get('Actual_BM').value,
        actualUpperLimit:  this.inspectionsForm.get('Actual_UL').value,
        actualLowerLimit: this.inspectionsForm.get('Actual_LL').value,
        deviation: this.inspectionsForm.get('Deviation_BM').value,
        status: this.inspectionsForm.get('partStatus').value,
        partIdentificationNumber: this.selectedPartNum
      };
      console.log('part list :' + this.partIdentificationList.length);
      const existingPartNum: PartIdentificationData
      = this.partIdentificationList.find(i => i.partIdentificationNumber === this.selectedPartNum) ;
      if (existingPartNum != null) {
        if (this.selectedMeasurementName === existingPartNum.measurementName) {
          console.log('ele deleted  :' + this.partIdentificationList.length);
          this.partIdentificationList.splice((this.partIdentificationList.indexOf(existingPartNum), 1));
        }
        console.log('list is empty  :' + this.partIdentificationList.length);
      }
      tempPartNum.partVerifId = this.selectedLineItem.partVerifId;
      this.partIdentificationList.push(tempPartNum);
      this.inspectionService.saveMeasruements(tempPartNum).subscribe(
        (response) => {
          console.log('respone after save measurement:' + response);
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'SUCCESS',
            content: 'Measurement Saved!',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.INFO
          });
          const inspectedVal = Number(this.inspectionsForm.get('inspectedQuantity').value) + 1;
          console.log('inspectedVal:' + inspectedVal);
          this.inspectionsForm.get('inspectedQuantity').setValue(inspectedVal);
        },
        (error) => {
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'ERROR',
            content: 'Measurement not Saved!, Please try again',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.ERROR
          });
        }

      );
      }
      console.log('part list :' + this.partIdentificationList.length);
    }

  savePartData() {
    if (!this.isMeasurementsLoadedToPart()) {
      this.inspectionReportService.createPIForPart( this.mapInspectionMeasurement())
      .subscribe(
        (response) => {
          console.log(response.body.reportData);
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'SUCCESS',
            content: 'Inspection Part Saved!',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.INFO
          });
          // this.partNumberSw = false;
          // this.inspectionsForm.get('partIdentificationNumber').setValue(null);
          // this.clearMeasurementsData();
        },
        (error) => {
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'ERROR',
            content: 'inspection Part not Saved!, Please try again',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.ERROR
          });
        });
    }
  }

  checkForSaveStatus() {
    if ((this.inspectionsForm.get('measuredValue').value === '' ||
    this.inspectionsForm.get('measuredValue').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('partStatus').value === '' ||
    this.inspectionsForm.get('partStatus').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('producedQuantity').value === '' ||
    this.inspectionsForm.get('producedQuantity').value === null)) {
      return false;
    }
   return this.addPartButtonEnableCheck();
  }
  addPartButtonEnableCheck() {
    if ((this.inspectionsForm.get('componentProductDrawingNumber').value === '' ||
    this.inspectionsForm.get('componentProductDrawingNumber').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('inspectionReportNumber').value === '' ||
    this.inspectionsForm.get('inspectionReportNumber').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('shiftID').value === '' ||
    this.inspectionsForm.get('shiftID').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('machineID').value === '' ||
    this.inspectionsForm.get('machineID').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('inspectionType').value === '' ||
    this.inspectionsForm.get('inspectionType').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('inspectionStage').value === '' ||
    this.inspectionsForm.get('inspectionStage').value === null)) {
      return false;
    }
    if ((this.inspectionsForm.get('partIdentificationNumber').value === '' ||
    this.inspectionsForm.get('partIdentificationNumber').value === null)) {
      return false;
    }
    return true;
  }

  isMeasurementsLoadedToPart() {
    let failed = false;
    this.measurementNamesList.forEach((mName) => {
      const partItemFound = this.partIdentificationList.findIndex
      (i => i.partIdentificationNumber === this.selectedPartNum && i.measurementName === mName.mName && i.status != null);
      if (partItemFound === -1) {
        failed =  true;
        this.openConfirmationDialog(<InspectionMeasurementDialog>{
          title: 'SUCCESS',
          content: 'Please complete all the measurements!',
          confirm: false,
          fomControlName: 'partIdentificationNumber',
          message: 'Ok',
          enableControlsOrExit: false,
          type: AlertType.ERROR
        });
        return;
      }
    });
    return failed;
  }

  saveReport() {
    if (!this.isMeasurementsLoadedToPart()) {
      this.inspectionReportService.createPIForReport(this.mapInspectionMeasurement())
      .subscribe(
        (response) => {
          console.log(response.body.reportData);
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'SUCCESS',
            content: 'Inspection Report Saved!',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.INFO
          });
          this.clearReport();
        },
        (error) => {
          this.openConfirmationDialog(<InspectionMeasurementDialog>{
            title: 'ERROR',
            content: 'inspection Report not Saved!, Please try again',
            confirm: false,
            fomControlName: 'partIdentificationNumber',
            message: 'Ok',
            enableControlsOrExit: false,
            type: AlertType.ERROR
          });
        });
    }
  }
  clearReport() {
    this.selectedReportNum = null;
    this.partNumberSw = false;
    this.selectedPartNum = 0;
    this.selectedLineItem = null;
    this.measurementStatus = null;
    this.partIdentificationList = [];
    this.measurementId = 0;
    this.measurementNamesList = [];
    this.selectedMeasurementName = null;
    this.lineItemList = [];
    this.formDirective.resetForm();
    this.inspectionsForm.reset();
    // this.inspectionsForm.get('componentProductDrawingNumber').setValue(null);
    // this.inspectionsForm.get('inspectionReportNumber').setValue(null);
    // this.inspectionsForm.get('shiftID').setValue(null);
    // this.inspectionsForm.get('machineID').setValue(null);
    // this.inspectionsForm.get('inspectionType').setValue(null);
    // this.inspectionsForm.get('inspectionStage').setValue(null);
    // this.inspectionsForm.get('partIdentificationNumber').setValue(null);
    // this.clearMeasurementsData();
  }
  clearMeasurementsData() {
    this.inspectionsForm.get('Desired_BM').setValue(null);
    this.inspectionsForm.get('Desired_LL').setValue(null);
    this.inspectionsForm.get('Desired_UL').setValue(null);
    this.inspectionsForm.get('Actual_BM').setValue(null);
    this.inspectionsForm.get('Actual_LL').setValue(null);
    this.inspectionsForm.get('Actual_UL').setValue(null);
    this.inspectionsForm.get('Deviation_BM').setValue(null);
    this.inspectionsForm.get('Deviation_LL').setValue(null);
    this.inspectionsForm.get('Deviation_UL').setValue(null);
    this.inspectionsForm.get('measuredValue').setValue(null);
    this.measurementStatus = null;
  }

  checkProducedQuantity() {
    const producedQunatity = this.inspectionsForm.get('producedQuantity').value;
    const manfSize = this.selectedReportNum.manufacturingBatchSize;
    console.log('manfSize' + manfSize);
    if (producedQunatity > manfSize) {
      this.openConfirmationDialog(<InspectionMeasurementDialog>{
        title: 'ERROR',
        content: 'Entered Qunatity is more than Batch Qunatity',
        confirm: false,
        fomControlName: 'partIdentificationNumber',
        message: 'Ok',
        enableControlsOrExit: false,
        type: AlertType.ERROR
      });
    }
  }
}
