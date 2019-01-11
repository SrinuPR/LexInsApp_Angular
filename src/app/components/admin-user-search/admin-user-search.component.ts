import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { UserDetailsModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-admin-user-search',
  templateUrl: './admin-user-search.component.html',
  styleUrls: ['./admin-user-search.component.css']
})
export class AdminUserSearchComponent implements OnInit {

  @ViewChild('searchDirForm') searchDirForm;
  userSearchForm: FormGroup;
  userNotExists = false;
  showErrorMsg = false;
  loginResponse: UserDetailsModel;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public commonService: CommonService,
        public activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
      this.buildFormControls();
    }

    buildFormControls() {
      this.userSearchForm = this.formBuilder.group({
        userId: new FormControl('', [Validators.required]),
        userOperation: new FormControl('', [Validators.required]),
      });
    }

    displayErrorMessages(field: string) {
      const control = this.userSearchForm.get(field);
      if (control) {
        return (control.touched && control.invalid);
      }
      return false;
    }

    verifyUserId() {
      const userId = this.userSearchForm.get('userId').value;
      this.commonService.userSearch(userId).subscribe(
        (response) => {
          if (response !== null) {
            this.userNotExists = true;
            this.showErrorMsg = false;
          }
        },
        (error) => {
          if (error !==  null) {
            this.userNotExists = false;
            this.showErrorMsg = true;
          }
        }
      );
    }

    selectedAction() {
      const userAction = this.userSearchForm.get('userOperation').value;
      const userId = this.userSearchForm.get('userId').value;
      if (userAction !== null && userAction === 'Unlock User') {
        this.commonService.selectedAction(userId).subscribe(
          (response) => {
            if (response !== null) {
              this.searchDirForm.resetForm();
              this.userSearchForm.reset();
              this.userNotExists = true;
              this.showErrorMsg = false;
              this.commonService.triggerAlerts({message: 'User unlocked successfully ', showAlert: true, isSuccess: true});
            }
          },
          (error) => {
            this.searchDirForm.resetForm();
            this.userSearchForm.reset();
            this.userNotExists = true;
            this.showErrorMsg = false;
            this.commonService.triggerAlerts({message: 'Something went wrong, Please try again. ', showAlert: true, isSuccess: false});
          }
        );
      }
    }

}
