import { Injectable } from '@angular/core';
import { WorkJobOrder } from '../interfaces/work-job-order';
import { HttpService } from './http.service';
import { ComponentProductMaster } from '../interfaces/component-product-master';

@Injectable({
    providedIn: 'root'
})
export class WorkJobOrderService {
    constructor(public httpService: HttpService) { }
    workJobOrder: WorkJobOrder;

    getComponentData(subscriberId: number) {
        return this.httpService.get('workjoborder/componentData/' + subscriberId);
    }

    getCustomerPOData(subscriberId: number) {
        return this.httpService.get('workjoborder/customerpo/' + subscriberId);
    }

}
