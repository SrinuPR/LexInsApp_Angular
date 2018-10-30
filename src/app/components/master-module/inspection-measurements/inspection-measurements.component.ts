import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inspection-measurements',
  templateUrl: './inspection-measurements.component.html',
  styleUrls: ['./inspection-measurements.component.css']
})
export class InspectionMeasurementsComponent implements OnInit {

  inspectionsForm: FormGroup;
    measurementNamesForm: FormArray = new FormArray([]);
    subscribersList = [
        { text: 'Deloitte', value: 1 },
        { text: 'Symphony', value: 2 }
    ];
    measurementNamesList = [
      {name: 'length', value: 24},
      {name: 'breadth', value: 24.01}
    ];
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
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
    }

    buildFormControls() {
        this.inspectionsForm = this.formBuilder.group({
            componentProductDrawingNumber: new FormControl('', [Validators.required]),
            inspectionReportNumber: new FormControl('', [Validators.required]),
            MachineID: new FormControl('', [Validators.required]),
            shiftID: new FormControl('', [Validators.required]),
            shiftName: new FormControl('', [Validators.required]),
            machineName: new FormControl('', [Validators.required]),
            batchNumber: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            componentProductNumber: new FormControl('', [Validators.required]),
            componentProductMaterial: new FormControl('', [Validators.required]),
            inspectionType: new FormControl('', [Validators.required]),
            inspectionStage: new FormControl('', [Validators.required]),
            inspectionDate: new FormControl('', [Validators.required]),
            partIdentificationNumber: new FormControl('', [Validators.required]),
            mNames: this.measurementNamesForm,
            measuredValue: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            1_1: new FormControl('', [Validators.required]),
            1_2: new FormControl('', [Validators.required]),
            1_3: new FormControl('', [Validators.required]),
            2_1: new FormControl('', [Validators.required]),
            2_2: new FormControl('', [Validators.required]),
            2_3: new FormControl('', [Validators.required]),
            3_1: new FormControl('', [Validators.required]),
            3_2: new FormControl('', [Validators.required]),
            3_3: new FormControl('', [Validators.required]),
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

}
