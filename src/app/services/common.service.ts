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
import { MatDialog } from '@angular/material';
import { ModalPopUpComponent } from '../common-components/alerts/modal-popup.component';
import { Alert } from '../interfaces/alert';
import { SessionService } from './session.service';

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
    public http: HttpClient,
    public dialog: MatDialog,
    private sessionService: SessionService
  ) { }

  triggerAlerts(alertObject: Alert) {
    this.showAlerts.next(alertObject);
  }

  clearAlerts() {
    this.clearOrHideAlerts.next();
  }

  async userLogin1(userName: string, pwd: string) {
    const body = {
      userId: userName,
      password: pwd
    };
    const response = await this.httpService.post1('user/login', body);
    const userData = JSON.stringify(response);
    this.userDtls = JSON.parse(userData);
    this.sessionService.setSession(this.userDtls);
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

  checkDuplicateCustomerPO(customerPONumber: string) {
    return this.httpService.get('purchaseOrder/validate/' + customerPONumber);
  }

  updateCustomerPO(object: CustomerPO) {
    return this.httpService.post('purchaseOrder/update', object);
  }

  deleteCustomerPO(customerPoId: number) {
    return this.httpService.get('purchaseOrder/delete/' + customerPoId.toString());
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
     const userData =  JSON.stringify(response);
     console.log('response:' + userData);
    return JSON.parse(userData);
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
    return this.httpService.get('createShiftMaster/all/', this.userDtls.subscriberId);
  }

  createShift(object: Shift) {
    return this.httpService.post('createShiftMaster/createShift', object);
  }

  updateShift(object: Shift) {
    return this.httpService.post('createShiftMaster/updateShift', object);
  }

  deleteShift(shiftId: string) {
    return this.httpService.get('createShiftMaster/delete/', shiftId);
  }

  checkShift(shiftID: string) {
    return this.httpService.get('createShiftMaster/validate/', shiftID);
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
  validateResourceIdentifier(resourceUrl: string, resourceId: string): Observable<any> {
    if ( resourceId.length < 5 ) {
      console.log(resourceId.length);
      return;
      }
      let id = 0;
      try {
        id = Number(resourceId);
      } catch ( errorMessage) {
        console.log(errorMessage);
        return null;
      }
      return this.httpService.get(resourceUrl, id);
  }
  createOrUpdateResource(resourceUrl: string, resourceData: any) {
    return this.httpService.post(resourceUrl, resourceData);
  }

  displayPopUp(alert: Alert) {
    this.dialog.open(ModalPopUpComponent, {
      data: alert,
      width: '500px',
      disableClose: true,
      hasBackdrop: true
    });
  }

  getDrawingNumberList(subscriberId) {
    return this.httpService.get('insplineitem/componentproductdrawNum/', subscriberId);
  }

  getInspectionLineItemList(subscriberId) {
    return this.httpService.get('insplineitem/all');
  }
  checkMeasureName(object) {
    return this.httpService.post('insplineitem/validate/measurementname', object);
  }

  saveMeasureItem(object) {
    return this.httpService.post('insplineitem/measuresave', object);
  }

  saveMeasureItemReport(object) {
    return this.httpService.post('insplineitem/measuresave', object);
  }
}

