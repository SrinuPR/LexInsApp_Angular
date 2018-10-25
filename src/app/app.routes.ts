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
import { RouterGuardService } from './services/router-guard.service';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'subscriber', component: SubscriberComponent, canActivate: [RouterGuardService] },
      { path: 'user-master', component: UserMasterComponent, canActivate: [RouterGuardService] },
      { path: 'user-type-master', component: UserTypeMasterComponent, canActivate: [RouterGuardService] },
      { path: 'customer-po', component: CustomerPOComponent, canActivate: [RouterGuardService] },
      { path: 'inspection-type', component: InspectionTypeComponent, canActivate: [RouterGuardService] },
      { path: 'inspection-stage', component: InspectionStageComponent, canActivate: [RouterGuardService] },
      { path: 'facilities', component: FacilitiesComponent, canActivate: [RouterGuardService] },
      { path: 'shift', component: ShiftComponent, canActivate: [RouterGuardService] },
      { path: 'component-master', component: ComponentMasterComponent, canActivate: [RouterGuardService] },
      { path: 'work-job-order', component: WorkJobOrderComponent, canActivate: [RouterGuardService] },
      { path: 'inspections', component: InspectionsComponent, canActivate: [RouterGuardService] },
      { path: 'inspection-line-item', component: InspectionLineItemComponent, canActivate: [RouterGuardService] },
      { path: 'inspection-meaurements', component: InspectionMeasurementsComponent, canActivate: [RouterGuardService] },
      { path: 'inspection-report', component: InspectionReportComponent, canActivate: [RouterGuardService] }
    ]
    
  },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {
  resetMessages () {

  }
}
