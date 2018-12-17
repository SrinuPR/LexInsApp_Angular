import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionType } from 'src/app/interfaces/inspection-type';
import { InspectionStage } from 'src/app/interfaces/inspection-stage';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { InspectionMeasurementService } from 'src/app/services/inspection-measurement.service';
import { CommonService } from 'src/app/services/common.service';
import { InspectionReport } from 'src/app/interfaces/inspection-report';
import { InspectionMeasurement } from 'src/app/interfaces/inspection-measurement';
import { Facility } from 'src/app/interfaces/facility';
import { Shift } from '../shift/shift.component';


@Component({
  selector: 'app-inspection-measurements',
  templateUrl: './inspection-measurements.component.html',
  styleUrls: ['./inspection-measurements.component.css']
})
export class InspectionMeasurementsComponent implements OnInit {
    inspectionTypeList: InspectionType[];
    inspectionStageList: InspectionStage[];
    componentDataList: ComponentProductMaster[];
    inpectionReportList: InspectionReport[];
    facilities: Facility[];
    shifts: Shift[];
    inspectionsForm: FormGroup;
    measurementNamesForm: FormArray = new FormArray([]);
    measurementNamesList = [
      {name: 'length', value: 24},
      {name: 'breadth', value: 24.01}
    ];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public inspectionService: InspectionMeasurementService,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        if (this.measurementNamesList != null) {
          for (const mName of this.measurementNamesList) {
            const name = mName.name;
            this.measurementNamesForm.push(
              new FormGroup({
                name : new FormControl(name)
              })
            );
          }
        }
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
            batchNumber: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            inspectionType: new FormControl('', [Validators.required]),
            inspectionStage: new FormControl('', [Validators.required]),
            inspectionDate: new FormControl('', [Validators.required]),
            partIdentificationNumber: new FormControl('', [Validators.required]),
            mNames: this.measurementNamesForm,
            measuredValue: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            partStatus: new FormControl('', [Validators.required])
        });
        this.inspectionsForm.get('machineName').disable();
        this.inspectionsForm.get('shiftName').disable();
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
      this.inspectionService.getWorkJobOrderList(this.inspectionsForm.get('inspectionReportNumber').value)
        .subscribe((response) => {
          console.log(response);
          // this.inspectionsForm.get('').setValue();
        });
    }

    mapInspectionMeasurement() {
      return <InspectionMeasurement>{
            subscriberId: this.commonService.userDtls.subscriberId,
            subscriberName: this.commonService.userDtls.subscriberName,
            componentProductDrawNumber: this.inspectionsForm.get('componentProductDrawingNumber').value,
            inspectionReportNumber: this.inspectionsForm.get('inspectionReportNumber').value,
            workOrderId: this.inspectionsForm.get('wjoNumber').value,
            lotNumber: this.inspectionsForm.get('lotNumber').value,
            lozSize: this.inspectionsForm.get('lotSize').value,
            shiftId: this.inspectionsForm.get('shiftID').value,
            shiftName: this.inspectionsForm.get('shiftName').value,
            facilityMachineNumber: this.inspectionsForm.get('machineID').value,
            facilityMachineName: this.inspectionsForm.get('machineName').value,
            manufacturingBatchNumber: this.inspectionsForm.get('batchNumber').value,
            manufacturingBatchSize: this.inspectionsForm.get('manBatchSize').value,
            compProdName: this.inspectionsForm.get('compProdName').value,
            userName: this.inspectionsForm.get('userName').value,
            inspectionType: this.inspectionsForm.get('inspectionType').value,
            inspectionStage: this.inspectionsForm.get('inspectionStage').value,
            inspectionDate: this.inspectionsForm.get('inspectionDate').value,
            partIdentificationNumber: this.inspectionsForm.get('partIdentificationNumber').value,
            measuredValue: this.inspectionsForm.get('measuredValue').value,
            status: this.inspectionsForm.get('status').value,
            partStatus: this.inspectionsForm.get('partStatus').value
      };
    }

    onFacilityNumberSelection() {
      const facilityNumber = this.inspectionsForm.get('machineID').value;
      const facility = this.facilities.find((fac: Facility) => {
        return fac.facilityId === facilityNumber;
      });
      this.inspectionsForm.get('machineName').setValue(facility.facilityName);
    }

    onShiftIDSelection() {
      const shiftID = this.inspectionsForm.get('shiftID').value;
      const shift = this.shifts.find((shft: Shift) => {
        return shft.shiftId === shiftID;
      });
      this.inspectionsForm.get('shiftName').setValue(shift.shiftName);
    }

}
