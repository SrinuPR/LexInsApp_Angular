import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { InspectionMaster } from '../interfaces/inspection-master';

@Injectable({
    providedIn: 'root'
})
export class InspectionMasterService {

    constructor(public httpService: HttpService) { }

    getComponentData(subscriberId: number) {
        return this.httpService.get('workjoborder/compProdData/' + subscriberId);
    }

    getInspectionTypeList() {
        return this.httpService.get('inspectiontype/all/');
    }

    getInspectionStageList() {
        return this.httpService.get('inspectionstage/all/');
    }

    saveInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/save/', master);
    }

    getInspectionMasterList() {
        return this.httpService.get('inspectiontype/all/');
    }

    updateInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/update/', master);
    }

    validateInspectionStage(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/validateStage/', master);
    }

    deleteInspectionMaster(masterId: number) {
        return this.httpService.get('inspectionMaster/delete/' + masterId);
    }

}
