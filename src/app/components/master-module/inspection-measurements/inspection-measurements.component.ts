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

class Measurement {
  constructor(public mName: string ,
    public  mValue: string) {
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
    inspectionTypeList: InspectionType[];
    inspectionStageList: InspectionStage[];
    componentDataList: ComponentProductMaster[];
    inpectionReportList: InspectionReport[];
    facilities: Facility[];
    shifts: Shift[];
    inspectionsForm: FormGroup;
    measurementNamesForm: FormArray = new FormArray([]);
    measurementValuesForm: FormArray = new FormArray([]);
    measurementsControlMetada: Array<FormControlMetadata> = [];
    measurementNamesList = [
      new Measurement('length', '24' ) ,
      new Measurement('breadth', '24.01' )
    ];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public inspectionService: InspectionMeasurementService,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        // if (this.measurementNamesList != null) {
        //   for (const mName of this.measurementNamesList) {
        //     const name = mName.name;
        //     const value = mName.value;
        //     this.measurementNamesForm.push(
        //       new FormGroup({
        //         name : new FormControl(name)
        //       })
        //     );
        //     this.measurementValuesForm.push(
        //       new FormGroup({
        //         name : new FormControl(name + value)
        //       })
        //     );
        //   }
        // }
        this.buildFormControls();
        this.populateMeasurements();
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
            mNames: this.formBuilder.array([{}]),
            mValues: this.formBuilder.array([{}]),
            status: new FormControl('', [Validators.required]),
            partStatus: new FormControl('', [Validators.required])
        });
        this.inspectionsForm.get('machineName').disable();
        this.inspectionsForm.get('shiftName').disable();
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
