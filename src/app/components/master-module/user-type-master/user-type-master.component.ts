import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { UserService } from 'src/app/services/user.service';
import { UserType } from 'src/app/interfaces/user-type';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-user-type-master',
    templateUrl: './user-type-master.component.html',
    styleUrls: ['./user-type-master.component.scss']
})

export class UserTypeMasterComponent implements OnInit {
    userMasterForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public subcriberService: SubscriberService,
        public userService: UserService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.buildFormControls();
        this.subcriberService.getAllSubscribers().subscribe((response) => {
            this.subcriberService.allSubscribers = response.body.subMasterList;
        });
    }

    buildFormControls() {
        this.userMasterForm = this.formBuilder.group({
            subscriberID: new FormControl('', [Validators.required]),
            userTypeID: new FormControl(this.userService.userType.userTypeId, [Validators.required]),
            userTypeName: new FormControl(this.userService.userType.userTypeName, [Validators.required])
        });
    }

    displayErrorMessages(field: string) {
        const control = this.userMasterForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    getUserTypDetails(): UserType {
        return this.userService.userType = {
            userTypeId: Number(this.userMasterForm.get('userTypeID').value),
            userTypeName: this.userMasterForm.get('userTypeName').value
        };
    }

    verifyUserType() {
        const userType = this.getUserTypDetails();
        if (userType.userTypeId || userType.userTypeName) {
            this.userService.validateUserType(userType).subscribe((response) => {
                const status = response.body.message;
                const idControl = this.userMasterForm.get('userTypeID');
                const nameControl = this.userMasterForm.get('userTypeName');
                if (status === `User Type ID exists`) {
                    idControl.setErrors({'userTypeIDNotUnique': true });
                } else if (status === 'User Type ID not exists') {
                    this.resetFormControlErrors(['userTypeID']);
                } else if (status === `User Type Name exists`) {
                    nameControl.setErrors({'userTypeNameNotUnique': true });
                } else if (status === 'User Type Name not exists') {
                    this.resetFormControlErrors(['userTypeName']);
                } else if (status === 'User Type ID and User Type Name combination exists') {
                    this.resetFormControlErrors(['userTypeID', 'userTypeName']);
                    idControl.setErrors({'userTypeIDNameComboExists': true });
                    nameControl.setErrors({'userTypeIDNameComboExists': true });
                    this.commonService.triggerAlerts(
                        { message: status, showAlert: true, isSuccess: false });
                } else {
                    this.resetFormControlErrors(['userTypeID', 'userTypeName']);
                }
            });
        }
    }

    resetFormControlErrors(formNames: string[]) {
        formNames.forEach((formName: string) => {
            const formControl = this.userMasterForm.get(formName);
            if (formControl) {
                formControl.setErrors(null);
            }
        });
    }

    createOrUpdateUserType() {
        const userType = this.getUserTypDetails();
        userType.subscriberId = Number(this.userMasterForm.get('subscriberID').value);
        userType.createdBy = this.commonService.userDtls.userName;
        this.userService.createorUpdateUserType(userType).subscribe((response) => {
          console.log(response);
          const result = response.body;
          if (result.status === 'User Type Master Saved') {
            console.log('User Type Master saved successfully');
          }
        });
      }
}
