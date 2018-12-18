import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { InspectionMaster } from '../interfaces/inspection-master';
import { forkJoin } from 'rxjs';

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
        return this.httpService.get('inspectionMaster/all/');
    }

    updateInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/update/', master);
    }

    validateInspectionStage(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/validateStage/', master);
    }

    deleteInspectionMaster(master: InspectionMaster) {
        return this.httpService.post('inspectionMaster/delete', master);
    }

    getAllData(subscriberId: number) {
        const master = this.httpService.get('inspectionMaster/all/');
        const component = this.httpService.get('workjoborder/compProdData/' + subscriberId);
        const type = this.httpService.get('inspectiontype/all/');
        const stage = this.httpService.get('inspectionstage/all/');
        return forkJoin([master, component, type, stage]);
    }

}
