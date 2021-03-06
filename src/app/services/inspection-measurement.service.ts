import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { InspectionMeasurement } from '../interfaces/inspection-measurement';
import { PartIdentificationData } from '../interfaces/part-identification';

@Injectable({
    providedIn: 'root'
})
export class InspectionMeasurementService {

    constructor(public httpService: HttpService) { }

    getCompDrawNumList(subscriberId: number) {
        return this.httpService.get('inspectionMeasurement/componentDrawNum/' + subscriberId);
    }

    getWorkJobOrderList(compDrawNum: string) {
        return this.httpService.get('inspectionMeasurement/worJobkOrder/' + compDrawNum);
    }

    getInspectionReportList(compDrawNum: string) {
        return this.httpService.get('inspectionMeasurement/inspectionReport/' + compDrawNum);
    }

    getInspectionTypesList(compDrawNum: string) {
        return this.httpService.get('inspectionMeasurement/insptypes/' + compDrawNum);
    }

    saveInspectionMeasurement(measurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/save/', measurement);
    }

    updateInspectionMeasurement(measurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/update/', measurement);
    }

    saveMeasruements(partData: PartIdentificationData) {
        return this.httpService.post('inspectionMeasurement/saveMeasurement', partData);
    }

    /* validateInspectionStage(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/validateStage/', master);
    }

    deleteInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/delete', master);
    } */

    getInspectionMeasurementsList(compDrawNum: string) {
        return this.httpService.get('inspectionMeasurement/insptypes/' + compDrawNum);
    }
}
