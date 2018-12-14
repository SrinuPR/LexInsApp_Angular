import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { AppRouters } from './app.routes';

import { HomeComponent } from './components/home/home.component';
import { CreateAdminComponent } from '../app/components/create-admin/create-admin.component';
import { LoginComponent } from '../app/components/login/login.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { AdminDashboardComponent } from '../app/components/admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from '../app/components/admin-home/admin-home.component';
import { ResetPasswordComponent } from '../app/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../app/components/forgot-password/forgot-password.component';
import { SubscriberComponent } from '../app/components/master-module/subscriber/subscriber.component';
import { SubscribersComponent } from '../app/components/master-module/subcribers/subcribers.component';
import { UserMasterComponent } from '../app/components/master-module/user-master/user-master.component';
import { UserTypeMasterComponent } from '../app/components/master-module/user-type-master/user-type-master.component';
import { CustomerPOComponent } from '../app/components/master-module/customer-po/customer-po.component';
import { InspectionTypeComponent } from './components/master-module/inspection-type/inspection-type.component';
import { InspectionStageComponent } from './components/master-module/inspection-stage/inspection-stage.component';
import { FacilitiesComponent } from './components/master-module/facilities/facilities.component';
import { ShiftComponent } from './components/master-module/shift/shift.component';
import { ComponentMasterComponent } from './components/master-module/component-master/component-master.component';
import { WorkJobOrderComponent } from './components/master-module/work-job-order/work-job-order.component';
import { InspectionsComponent } from './components/master-module/inspections/inspections.component';
import { InspectionLineItemComponent } from './components/reports/inspection-line-item/inspection-line-item.component';
import { InspectionReportComponent } from './components/reports/inspection-report/inspection-report.component';
import { LoaderComponent } from './common-components/loader/loader.component';
import { PaginationComponent } from './common-components/pagination/pagination.component';
import { LeftNavComponent } from '../app/common-components/left-nav/left-nav.component';
import { HeaderComponent } from '../app/common-components/header/header.component';
import { AlertsComponent } from '../app/common-components/alerts/alert.component';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { DataService } from './services/data.service';
import { HttpService } from './services/http.service';
import { SessionService } from './services/session.service';
import {MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule,
   MAT_DIALOG_DATA, MAT_DATE_FORMATS, DateAdapter} from '@angular/material';

import { OnlyNumericDirective } from './directives/only-numeric';
import { InspectionMeasurementsComponent } from './components/master-module/inspection-measurements/inspection-measurements.component';
import { SubscriberService } from './services/subscriber.service';
import { UserService } from './services/user.service';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
import { LoaderService } from './services/loader.service';
import { WorkJobOrderConfirmDialogComponent } from './components/master-module/work-job-order/work-job-order-confirm-dialog.component';
import { AuthGuard } from './services/auth-guard.service';
import { ModalPopUpComponent } from './common-components/alerts/modal-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    CreateAdminComponent,
    AdminDashboardComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    SubscriberComponent,
    SubscribersComponent,
    UserMasterComponent,
    UserTypeMasterComponent,
    CustomerPOComponent,
    LeftNavComponent,
    HeaderComponent,
    InspectionTypeComponent,
    InspectionStageComponent,
    FacilitiesComponent,
    ShiftComponent,
    ComponentMasterComponent,
    WorkJobOrderComponent,
    InspectionsComponent,
    InspectionLineItemComponent,
    InspectionReportComponent,
    OnlyNumericDirective,
    AlertsComponent,
    LoaderComponent,
    PaginationComponent,
    InspectionMeasurementsComponent,
    WorkJobOrderConfirmDialogComponent,
    ModalPopUpComponent,
    AdminHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRouters,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  providers: [
    AuthService,
    CommonService,
    DataService,
    HttpService,
    AlertsComponent,
    SubscriberService,
    UserService,
    LoaderService,
    SessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    AuthGuard
  ],
  entryComponents: [WorkJobOrderConfirmDialogComponent, WorkJobOrderComponent, ModalPopUpComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
 }
