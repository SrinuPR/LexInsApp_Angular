import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { InspectionMeasurement } from '../interfaces/inspection-measurement';

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

    getInspectionTypesList(compDrawNum: string) {
        return this.httpService.get('inspectionMeasurement/insptypes/' + compDrawNum);
    }

    saveInspectionMeasurement(measurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/save/', measurement);
    }

    updateInspectionMeasurement(measurement: InspectionMeasurement) {
        return this.httpService.post('inspectionMeasurement/update/', measurement);
    }

    /* validateInspectionStage(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/validateStage/', master);
    }

    deleteInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/delete', master);
    } */

}
