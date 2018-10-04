import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})

export class ComponentMasterComponent implements OnInit {
    componentMasterForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.componentMasterForm = this.formBuilder.group({
        subscriberName: new FormControl(''),
        productDrawingNumber: new FormControl('', [Validators.required]),
        productDrawingName: new FormControl('', [Validators.required]),
        productNumber: new FormControl('', [Validators.required]),
        productMaterial: new FormControl('', [Validators.required]),
        productManufacturingUnits: new FormControl('', [Validators.required]),
        productNameAndAddress: new FormControl('', [Validators.required]),
        productNotes: new FormControl('', [Validators.required])
      });
    }

    displayErrorMessages(field: string) {
      const control = this.componentMasterForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }
}