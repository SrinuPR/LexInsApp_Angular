import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubscriberComponent } from '../app/components/master-module/subscriber/subscriber.component';
import { UserMasterComponent } from '../app/components/master-module/user-master/user-master.component';
import { UserTypeMasterComponent } from '../app/components/master-module/user-type-master/user-type-master.component';
import { CustomerPOComponent } from '../app/components/master-module/customer-po/customer-po.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InspectionTypeComponent } from './components/master-module/inspection-type/inspection-type.component';
import { InspectionStageComponent } from './components/master-module/inspection-stage/inspection-stage.component';
import { FacilitiesComponent } from './components/master-module/facilities/facilities.component';
import { ShiftComponent } from './components/master-module/shift/shift.component';
import { ComponentMasterComponent } from './components/master-module/component-master/component-master.component';
import { WorkJobOrderComponent } from './components/master-module/work-job-order/work-job-order.component';
import { InspectionsComponent } from './components/master-module/inspections/inspections.component';
import { InspectionLineItemComponent } from './components/reports/inspection-line-item/inspection-line-item.component'
import { InspectionMeasurementsComponent } from './components/master-module/inspection-measurements/inspection-measurements.component';
import { InspectionReportComponent } from './components/reports/inspection-report/inspection-report.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'subscriber', component: SubscriberComponent },
      { path: 'user-master', component: UserMasterComponent },
      { path: 'user-type-master', component: UserTypeMasterComponent },
      { path: 'customer-po', component: CustomerPOComponent },
      { path: 'inspection-type', component: InspectionTypeComponent },
      { path: 'inspection-stage', component: InspectionStageComponent },
      { path: 'facilities', component: FacilitiesComponent },
      { path: 'shift', component: ShiftComponent },
      { path: 'component-master', component: ComponentMasterComponent },
      { path: 'work-job-order', component: WorkJobOrderComponent },
      { path: 'inspections', component: InspectionsComponent },
      { path: 'inspection-line-item', component: InspectionLineItemComponent },
      { path: 'inspection-meaurements', component: InspectionMeasurementsComponent },
      { path: 'inspection-report', component: InspectionReportComponent }
    ]
  },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {
  resetMessages () {

  }
}
