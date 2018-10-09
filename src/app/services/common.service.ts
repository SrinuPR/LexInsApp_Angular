import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { ComponentProductMaster } from '../interfaces/component-product-master';
import 'rxjs/add/operator/map';
import { CustomerPO } from '../interfaces/customer-po';
import { Subject } from 'rxjs/internal/Subject';

export interface Alert {
  message: string;
  showAlert: boolean;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showAlerts = new Subject<Alert>();
  showAlertsTrigger = this.showAlerts.asObservable();
  constructor(
    public httpService: HttpService,
    public http: HttpClient
  ) { }

  triggerAlerts(alertObject: Alert) {
    this.showAlerts.next(alertObject);
  }

  userLogin() {
    const body = {
      userId:'Srinu123',
      password: 'Srinu123'
    }
    return this.httpService.post('user/login', body)
    .subscribe((response) => {
      console.log(response);
    });
  }

  getComponentProductMasterList() {
    return this.httpService.get('component/all');
  }

  createComponentProductMaster(object: ComponentProductMaster) {
   return this.httpService.post('component/save', object);
  }

  updateComponentProductMaster(object: ComponentProductMaster) {
    return this.httpService.post('component/update', object);
  }

  deleteComponentProductMaster(componentId: number) {
    return this.httpService.get('component/delete/', componentId);
  }

  getCustomerPOList() {
    return this.httpService.get('component/all');
  }

  createCustomerPO(object: CustomerPO) {
   return this.httpService.post('component/save', object);
  }

  updateCustomerPO(object: CustomerPO) {
    return this.httpService.post('user/updateComponentProductMaster', object);
  }

  deleteCustomerPO(subscriberId: number) {
    return this.httpService.post('component/delete/', {subscriberId});
  }
}
