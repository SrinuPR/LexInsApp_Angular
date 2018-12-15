import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionType } from 'src/app/interfaces/inspection-type';
import { InspectionStage } from 'src/app/interfaces/inspection-stage';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { InspectionMeasurementService } from 'src/app/services/inspection-measurement.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-inspection-measurements',
  templateUrl: './inspection-measurements.component.html',
  styleUrls: ['./inspection-measurements.component.css']
})
export class InspectionMeasurementsComponent implements OnInit {
    inspectionTypeList: InspectionType[];
    inspectionStageList: InspectionStage[];
    componentDataList: ComponentProductMaster[];
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
          this.componentDataList = response.body.componentData;
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
            // componentProductNumber: new FormControl('', [Validators.required]),
            // componentProductMaterial: new FormControl('', [Validators.required]),
            inspectionType: new FormControl('', [Validators.required]),
            inspectionStage: new FormControl('', [Validators.required]),
            inspectionDate: new FormControl('', [Validators.required]),
            partIdentificationNumber: new FormControl('', [Validators.required]),
            mNames: this.measurementNamesForm,
            measuredValue: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            partStatus: new FormControl('', [Validators.required])
        });
    }

    displayErrorMessages (field: string) {
        const control = this.inspectionsForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    onProdDrawNumberChange() {

    }

}
