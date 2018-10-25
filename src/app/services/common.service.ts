import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { ComponentProductMaster } from '../interfaces/component-product-master';
import 'rxjs/add/operator/map';
import { CustomerPO } from '../interfaces/customer-po';
import { Subject } from 'rxjs/internal/Subject';
import { UserDetailsModel } from '../models/user.model';
import { Shift } from '../components/master-module/shift/shift.component';
import { Facilities } from '../components/master-module/facilities/facilities.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showAlerts = new Subject<Alert>();
  clearOrHideAlerts = new Subject<{}>();
  showAlertsTrigger = this.showAlerts.asObservable();
  clearAlertsEvent = this.clearOrHideAlerts.asObservable();
  public userDtls: UserDetailsModel;

  constructor(
    public httpService: HttpService,
    public http: HttpClient
  ) { }

  triggerAlerts(alertObject: Alert) {
    this.showAlerts.next(alertObject);
  }

  clearAlerts() {
    this.clearOrHideAlerts.next();
  }

  async userLogin1(userName: string, pwd: string) {
    //const url = 'http://10.8.59.41:8888/'
    const body = {
      userId: userName,
      password: pwd
    };
    let response = await this.httpService.post1('user/login', body);
    let userData = JSON.stringify(response);
    this.userDtls = JSON.parse(userData);
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
    return this.httpService.get('purchaseOrder/all');
  }

  createCustomerPO(object: CustomerPO) {
    return this.httpService.post('purchaseOrder/save', object);
  }

  updateCustomerPO(object: CustomerPO) {
    return this.httpService.post('purchaseOrder/update', object);
  }

  deleteCustomerPO(customerPoId: number) {
    return this.httpService.post('purchaseOrder/delete/', { customerPoId });
  }

  async resetPassword(userName: string, pwd: string, newPwd: string, confNewPwd: string) {

    // const url = 'http://10.8.59.41:8888/';
    const body = {
      userId: userName,
      activePassword: pwd,
      newPassword: newPwd,
      emailId: null,
      status: 'yes',
      errorMessage: 'no'
    };
    const response = await this.httpService.post1('user/change/password', body);
    /* let userData =  JSON.stringify(response);
    this.userDtls = JSON.parse(userData); */

    console.log('response' + response);
    return response;
  }

  async forgotPassword(userName: string, emailId: string) {
    // const url = 'http://10.8.59.41:8888/';
    const body = {
      userId: userName,
      activePassword: null,
      newPassword: null,
      emailId: emailId,
      status: 'yes',
      errorMessage: 'no'
    };
    const response = await this.httpService.post1('user/forgot/password', body);
    const userData = JSON.stringify(response);
    this.userDtls = JSON.parse(userData);
  }

  getShiftList() {
    return this.httpService.get('component/all');
  }

  createShift(object: Shift) {
    return this.httpService.post('component/save', object);
  }

  updateShift(object: Shift) {
    return this.httpService.post('component/update', object);
  }

  deleteShift(shiftId: string) {
    return this.httpService.get('component/delete/', shiftId);
  }

  getFacilityList() {
    return this.httpService.get('facilities/all');
  }

  checkFacilityNumber(facilityNumber: string) {
    return this.httpService.get('facilities/', facilityNumber);
  }

  createFacility(object: Facilities) {
    return this.httpService.post('facilities/create', object);
  }
  validateResourceIdentifier(resourceUrl: string,resourceId: number): Observable<any> {
    return this.httpService.get(resourceUrl,resourceId);
}
createOrUpdateResource(resourceUrl: string,resourceData: any) {
  return this.httpService.post(resourceUrl, resourceData);
}
}

export interface Alert {
  message: string;
  showAlert: boolean;
  isSuccess: boolean;
}
