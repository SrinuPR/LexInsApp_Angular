import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-user-master',
    templateUrl: './user-master.component.html',
    styleUrls: ['./user-master.component.scss']
})

export class UserMasterComponent implements OnInit {
    userMasterForm: FormGroup;
    constructor(
        public router: Router,
        public formBuilder: FormBuilder,
        public subscriberService: SubscriberService,
        public userService: UserService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.buildFormControls();
        this.subscriberService.getAllSubscribers();
    }

    buildFormControls() {
        this.userMasterForm = this.formBuilder.group({
            subscriberID: new FormControl('', [Validators.required]),
            userTypeID: new FormControl('', [Validators.required]),
            userID: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            newPassword: new FormControl('', [Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
            confirmPassword: new FormControl('', [Validators.required])
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup): { [key: string]: any } | null {
        const password = group.get('newPassword').value;
        const cnfPassword = group.get('confirmPassword').value;
        return (password && cnfPassword && password !== cnfPassword) ? { notSame: true } : null;
    }

    displayErrorMessages(field: string) {
        const control = this.userMasterForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    getApplicableUserTypes() {
        const subscriberId = this.userMasterForm.get('subscriberID').value;
        this.userService.getAllApplicableUserTypes(Number(subscriberId)).subscribe((response) => {
            console.log(response);
            this.userService.allUserTypes = response.body;
        });
    }

    createUserMaster() {
        const user = this.mapUserMaster();
        user.createdBy = this.commonService.userDtls.userName;
        this.userService.createOrUpdateUser(user).subscribe((response) => {
            const result = response.body;
            console.log('User Master saved successfully');
            this.commonService.triggerAlerts(
                { message: 'User Saved', showAlert: true, isSuccess: true });
        }, (error) => {
            let message = 'User NOT saved, please try again';
            if (error.error.errorMessage === 'Subscriber already have the users of  5') {
                message = 'No. of Users count exceed for this Subscriber';
            }
            this.commonService.triggerAlerts(
                { message: message, showAlert: true, isSuccess: false });
        });
    }

    mapUserMaster(): User {
        return <User>{
            subscriberId: Number(this.userMasterForm.get('subscriberID').value),
            userTypeId: Number(this.userMasterForm.get('userTypeID').value),
            userId: this.userMasterForm.get('userID').value,
            userName: this.userMasterForm.get('userName').value,
            password: this.userMasterForm.get('newPassword').value,
            confirmPassword: this.userMasterForm.get('confirmPassword').value
        };
    }

    verifyUserId() {
        const control = this.userMasterForm.get('userID');
        this.userService.validateUserId(control.value).subscribe((response) => {
            console.log('User Id validation success', response.body);
            if (response.body.status === 'Success') {
                control.setErrors(null);
            }
        }, (error) => {
            console.log('Error while validating user id');
            control.setErrors({ 'userIdNotUnique': true });
        });
    }
}
