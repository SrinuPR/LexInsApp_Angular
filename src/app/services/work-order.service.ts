import { Injectable } from '@angular/core';
import { WorkJobOrder, WorkJobOrderConfirm } from '../interfaces/work-job-order';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class WorkJobOrderService {

    workJobOrder: WorkJobOrder;
    wJOrderConfirm: WorkJobOrderConfirm;

    constructor(public httpService: HttpService) {
        this.workJobOrder = {};
        this.wJOrderConfirm = {};
    }

    getComponentData(subscriberId: number) {
        return this.httpService.get('workjoborder/componentData/' + subscriberId);
    }

    getCustomerPOData(subscriberId: number) {
        return this.httpService.get('workjoborder/customerpo/' + subscriberId);
    }

    validateWorkJobOrderAndCustomerPO(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/validate/workJobOrderNumber/', wjOrder);
    }

    createWorkJobOrder(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/save', wjOrder);
    }

    validateLotNumber(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/validate/lotNumber/', wjOrder);
    }

    validateLotSize(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/validate/lotsize/', wjOrder);
    }

    validateManufacturerBatchNumber(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/validate/ManfBatchNumber/', wjOrder);
    }

    validateManufacturerBatchSize(wjOrder: WorkJobOrder) {
        return this.httpService.post('workjoborder/validate/ManfBatchSize/', wjOrder);
    }

    getWorkJobOrderList() {
        return this.httpService.get('workjoborder/all');
    }

    deleteWorkJobOrder(workJobOrderId: number) {
        return this.httpService.get('workjoborder/delete/' + workJobOrderId);
    }

}
