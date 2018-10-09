import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { AppRouters } from './app.routes';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from '../app/components/login/login.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { ResetPasswordComponent } from '../app/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../app/components/forgot-password/forgot-password.component';
import { SubscriberComponent } from '../app/components/master-module/subscriber/subscriber.component';
import { UserMasterComponent } from '../app/components/master-module/user-master/user-master.component';
import { UserTypeMasterComponent } from '../app/components/master-module/user-type-master/user-type-master.component';
import { CustomerPOComponent } from '../app/components/master-module/customer-po/customer-po.component';
import { InspectionTypeComponent } from './components/master-module/inspection-type/inspection-type.component';
import { InspectionStageComponent } from './components/master-module/inspection-stage/inspection-stage.component';
import { FacilitiesComponent } from './components/master-module/facilities/facilities.component';
import { ShiftComponent } from './components/master-module/shift/shift.component';
import { ComponentMasterComponent } from './components/master-module/component-master/component-master.component';
import { WorkJobOrderComponent } from './components/master-module/work-job-order/work-job-order.component';
import { InspectionsComponent } from './components/master-module/inspections/inspections.component'
import { InspectionLineItemComponent } from './components/reports/inspection-line-item/inspection-line-item.component'
import { LoaderComponent } from './common-components/loader/loader.component';
import { LeftNavComponent } from '../app/common-components/left-nav/left-nav.component';
import { HeaderComponent } from '../app/common-components/header/header.component';
import { AlertsComponent } from '../app/common-components/alerts/alert.component'
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { DataService } from './services/data.service';
import { HttpService } from './services/http.service';

import { OnlyNumericDirective } from './directives/only-numeric'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    SubscriberComponent,
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
    OnlyNumericDirective,
    AlertsComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRouters,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    CommonService,
    DataService,
    HttpService,
    AlertsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
