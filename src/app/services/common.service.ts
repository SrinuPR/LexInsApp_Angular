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
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  masterScreensDataList = [
    { id: 'T01', displayText: 'Home', route: 'home', isChecked: false, isActive: false },
    { id: 'T02', displayText: 'Inspection Type', route: 'inspection-type', isChecked: false, isActive: false },
    { id: 'T03', displayText: 'Inspection Stage', route: 'inspection-stage', isChecked: false, isActive: false },
    { id: 'T04', displayText: 'Facilities', route: 'facilities', isChecked: false, isActive: false },
    { id: 'T05', displayText: 'Shift', route: 'shift', isChecked: false, isActive: false },
    { id: 'T06', displayText: 'Component Master', route: 'component-master', isChecked: false, isActive: false },
    { id: 'T07', displayText: 'Customer P.O.', route: 'customer-po', isChecked: false, isActive: false },
    { id: 'T08', displayText: 'Work Job Order', route: 'work-job-order', isChecked: false, isActive: false },
    { id: 'T09', displayText: 'Inspection Master', route: 'inspections', isChecked: false, isActive: false },
    { id: 'T10', displayText: 'Inspection-line-item', route: 'inspection-line-item', isChecked: false, isActive: false },
    { id: 'T11', displayText: 'Inspection-Report', route: 'inspection-report', isChecked: false, isActive: false },
    { id: 'T12', displayText: 'Inspection Measurements', route: 'inspection-meaurements', isChecked: false, isActive: false }
  ];
  adminJSON = [
    { id: 'T01', displayText: 'Subscribers', route: 'subscribers', isActive: false },
    { id: 'T02', displayText: 'Create Admin', route: 'create-admin', isActive: false },
    { id: 'T03', displayText: 'Create Subscriber', route: 'create-subscriber', isActive: false },
    { id: 'T04', displayText: 'User Type List', route: 'user-type-master', isActive: false },
    { id: 'T05', displayText: 'User Master', route: 'user-master', isActive: false },
    { id: 'T06', displayText: 'Subscriber Screens', route: 'subscriber-master-screens', isActive: false },
    { id: 'T07', displayText: 'Users Screens', route: 'subscriber-user-screens', isActive: false },
    { id: 'T08', displayText: 'Users Search', route: 'app-admin-user-search', isActive: false }
  ];
  leftNavJSON = [];
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

  getLeftNavData() {
    const menuJSON = [];
    if (this.userDtls.screenList) {
      _.forEach(this.masterScreensDataList, (item) => {
        if (this.userDtls.screenList.indexOf(item.id) > -1) {
          menuJSON.push(item);
        }
      });
      return menuJSON;
    }
    return this.masterScreensDataList;
  }

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

  createAdmin(object) {
    return this.httpService.post('user/admin/create', object);
  }

  validateAdmin(adminId) {
    return this.httpService.get('/user/admin/vaidate/' + adminId);
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
    const userData = JSON.stringify(response);
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
    if (resourceId.length < 5) {
      console.log(resourceId.length);
      return;
    }
    let id = 0;
    try {
      id = Number(resourceId);
    } catch (errorMessage) {
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
    return this.httpService.get('insplineitem/all/' + subscriberId);
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

  saveSubscriberScreens(object) {
    return this.httpService.post('mloss/saveData', object);
  }

  saveSubscribersUserScreens(object) {
    return this.httpService.post('accessControl/save', object);
  }

  getMSubscriberDashBoardDetails() {
    return this.httpService.get('dashboard/userData/' + this.userDtls.userId);
  }

  deepCopy(data: any) {
    let node;
    if (Array.isArray(data)) {
      node = data.length > 0 ? data.slice(0) : [];
      node.forEach((e, i) => {
        if (
          (typeof e === 'object' && e !== {}) ||
          (Array.isArray(e) && e.length > 0)
        ) {
          node[i] = this.deepCopy(e);
        }
      });
    } else if (data && typeof data === 'object') {
      node = data instanceof Date ? data : Object.assign({}, data);
      Object.keys(node).forEach((key) => {
        if (
          (typeof node[key] === 'object' && node[key] !== {}) ||
          (Array.isArray(node[key]) && node[key].length > 0)
        ) {
          node[key] = this.deepCopy(node[key]);
        }
      });
    } else {
      node = data;
    }
    return node;
  }
  logout() {
      console.log('this.userDtls.userId' + this.userDtls.userId + 'this.userDtls.subscriber id ' + this.userDtls.subscriberId);
    return this.httpService.get('user/logout/' + this.userDtls.userId).subscribe(
      (response) => {
        this.userDtls = null;
        console.log(response);
      }
    );
  }
  userSearch(userId: string) {
    return this.httpService.get('user/validateUser/' + userId);
  }
  selectedAction(userId: String) {
    return this.httpService.get('user/unLock/' + userId);
  }

  logoutOnPwdChange(userId?: string) {
    return this.httpService.get('user/logout/' + userId).subscribe(
      (response) => {
        console.log('logout on password change success');
      }
    );
  }
}

