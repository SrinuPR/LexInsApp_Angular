import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ComponentProductMaster } from 'src/app/interfaces/component-product-master';
import { InspectionMasterService } from 'src/app/services/inspection.service';
import { InspectionType } from 'src/app/interfaces/inspection-type';
import { InspectionStage } from 'src/app/interfaces/inspection-stage';
import { InspectionMaster } from 'src/app/interfaces/inspection-master';
import { AlertType } from 'src/app/interfaces/alert';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface TableMap {
  columnDef?: string;
  columnName?: string;
}

@Component({
    selector: 'app-inspections',
    templateUrl: './inspections.component.html',
    styleUrls: ['./inspections.component.scss']
})
export class InspectionsComponent implements OnInit {
    tableColumns: TableMap[] = [{
      columnDef: 'componentProductDrawNumber',
      columnName: 'Component / Product Drawing Number'
    }, {
      columnDef: 'componentProductNumber',
      columnName: 'Component Product Number'
    }, {
      columnDef: 'componentProductName',
      columnName: 'Component Product Name'
    }, {
      columnDef: 'inspectionType',
      columnName: 'Inspection Type'
    }, {
      columnDef: 'inspectionStage',
      columnName: 'Inspection Stage'
    }];
    displayedColumns: string[] = this.tableColumns.map(c => c.columnDef);
    INSPECTION_MASTER_EXISTS = 'Inspection Master Exists';
    INSPECTION_MASTER_NOT_EXISTS = 'Inspection Master Does Not Exist';
    UN_EXPECTED_EXCEPTION = 'UnExpected exception occurred';
    inspectionsForm: FormGroup;
    inspectionTypeList: InspectionType[];
    inspectionStageList: InspectionStage[];
    componentDataList: ComponentProductMaster[];
    selectedInspectionMaster: InspectionMaster;
    inspectionMasterList: InspectionMaster[];
    isUpdate = false;
    dataSource: MatTableDataSource<InspectionMaster>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public inspectionService: InspectionMasterService
    ) {
        this.componentDataList = [];
        this.selectedInspectionMaster = {};
        this.inspectionMasterList = [];
    }
    ngOnInit() {
      this.displayedColumns.push('edit');
      this.displayedColumns.push('delete');
        this.inspectionService.getComponentData(this.commonService.userDtls.subscriberId)
        .subscribe((response) => {
          this.componentDataList = response.body.componentData;
        });
        this.inspectionService.getInspectionStageList()
        .subscribe((response) => {
          this.inspectionStageList = response.body.inspStageMasterList;
        });
        this.inspectionService.getInspectionTypeList()
        .subscribe((response) => {
          this.inspectionTypeList = response.body.inspTypeMasterList;
        });
        this.buildFormControls();
        this.getInspectionMasterList();
        this.inspectionsForm.get('subscriberName').disable();
        this.inspectionsForm.get('componentProductNumber').disable();
        this.inspectionsForm.get('componentProductName').disable();
        this.inspectionsForm.get('componentProductMaterial').disable();
        this.inspectionsForm.get('componentProductNotes').disable();
    }

    buildFormControls() {
        this.inspectionsForm = this.formBuilder.group({
            subscriberName: new FormControl(this.commonService.userDtls.subscriberName, [Validators.required]),
            componentProductDrawingNumber: new FormControl(this.selectedInspectionMaster.componentProductDrawNumber, [Validators.required]),
            componentProductName: new FormControl(this.selectedInspectionMaster.componentProductName, [Validators.required]),
            componentProductNumber: new FormControl(this.selectedInspectionMaster.componentProductNumber, [Validators.required]),
            componentProductMaterial: new FormControl(this.selectedInspectionMaster.componentProductMaterial, [Validators.required]),
            inspectionType: new FormControl(this.selectedInspectionMaster.inspectionType, [Validators.required]),
            inspectionStage: new FormControl(this.selectedInspectionMaster.inspectionStage, [Validators.required]),
            componentProductNotes: new FormControl(this.selectedInspectionMaster.componentProductNotes, [Validators.required])
        });
    }

    displayErrorMessages(field: string) {
        const control = this.inspectionsForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    onProdDrawNumberChange() {
        const chosenDrawNum = this.inspectionsForm.get('componentProductDrawingNumber').value;
        const component = this.componentDataList.find((compData: ComponentProductMaster) => {
            return compData.componentProductDrawNumber === chosenDrawNum;
        });
        this.inspectionsForm.get('componentProductNumber').setValue(component.componentProductNumber);
        this.inspectionsForm.get('componentProductName').setValue(component.componentProductName);
        this.inspectionsForm.get('componentProductMaterial').setValue(component.componentProductMeterial);
        this.inspectionsForm.get('componentProductNotes').setValue(component.componentProductNotes);
    }

    mapInspectionMaster() {
        return <InspectionMaster> {
          componentProductDrawNumber: this.inspectionsForm.get('componentProductDrawingNumber').value,
          componentProductName: this.inspectionsForm.get('componentProductName').value,
          componentProductNumber: this.inspectionsForm.get('componentProductNumber').value,
          componentProductMaterial: this.inspectionsForm.get('componentProductMaterial').value,
          componentProductNotes: this.inspectionsForm.get('componentProductNotes').value,
          inspectionType: Number(this.inspectionsForm.get('inspectionType').value),
          inspectionStage: Number(this.inspectionsForm.get('inspectionStage').value),
          subscriberId: this.commonService.userDtls.subscriberId,
          subscriberName: this.inspectionsForm.get('subscriberName').value
        };
      }

    saveInspectionMaster() {
        const inspectionMaster = this.mapInspectionMaster();
        this.inspectionService.saveInspectionMaster(inspectionMaster).
          subscribe((response) => {
            console.log(response);
            this.selectedInspectionMaster = {};
            this.inspectionMasterList.push(inspectionMaster);
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

      validateInspectionStage() {
        const inspectionMaster = this.mapInspectionMaster();
        this.inspectionService.validateInspectionStage(inspectionMaster).
          subscribe((response) => {
            console.log(response);
            const result = response.body;
            if (result.message === this.INSPECTION_MASTER_EXISTS) {
                this.commonService.displayPopUp({
                    message: response.body.message,
                    type: AlertType.ERROR
                });
            }
          }, (error) => {
            if (error && error.error) {
              this.commonService.displayPopUp({
                message: error.error.message,
                type: AlertType.ERROR
              });
            }
          });
      }

      updateInspectionMaster() {

      }

      editInspectionMaster(master: InspectionMaster) {
        this.selectedInspectionMaster = master;
        this.isUpdate = true;
        this.buildFormControls();
        this.commonService.clearAlerts();
      }

      deleteInspectionMaster(master: InspectionMaster) {
        this.inspectionService.deleteInspectionMaster(master.inspectionMasterId)
        .subscribe((response) => {
          const result = response.body;
          if (result && result.status === 'Success') {
            const index = this.inspectionMasterList.findIndex((data: InspectionMaster) => {
              return data.inspectionMasterId === master.inspectionMasterId;
            });
            this.inspectionMasterList.splice(index, 1);
            this.commonService.displayPopUp({
              message: result.message,
              type: AlertType.INFO
            });
          }
        });
      }

      getInspectionMasterList() {
        this.inspectionService.getInspectionMasterList().subscribe((response) => {
          const result = response.body;
          if (result.status === 'Success') {
            this.inspectionMasterList = result.results;
            this.dataSource = new MatTableDataSource<InspectionMaster>(this.inspectionMasterList);
            this.dataSource.paginator = this.paginator;
          }
        });
      }

      resetInspectionMaster() {
        this.selectedInspectionMaster = {};
        this.inspectionsForm.reset();
      }

}
