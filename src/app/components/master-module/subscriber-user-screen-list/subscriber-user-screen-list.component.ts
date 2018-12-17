import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubscriberService } from 'src/app/services/subscriber.service';
import * as _ from 'underscore';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-subscriber-user-screen-list',
    templateUrl: './subscriber-user-screen-list.component.html',
    styleUrls: ['./subscriber-user-screen-list.component.scss']
})

export class SubscriberUserScreenListComponent implements OnInit {
    subscriberForm: FormGroup;
    subscribersList = [];
    usersList = [];
    subscriberScreens: string;
    masterScreenList = [];

    constructor(
        private formBuilder: FormBuilder,
        public subscriberService: SubscriberService,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        this.getSubscribersList();
        this.subscriberForm = this.formBuilder.group({
            subscriberID: new FormControl('', [Validators.required]),
            userId: new FormControl('', [Validators.required])
        });
    }

    getSubscribersList() {
        this.subscriberService.getAllSubscribersLst().subscribe((response) => {
            this.subscribersList = response.body.subMasterList;
        });
    }

    subscriberChange() {
        this.subscriberService.getUsersList(this.subscriberForm.get('subscriberID').value).subscribe((response) => {
            this.usersList = response.body.result;
            this.subscriberScreens = response.body.subscriberScreens;
            this.masterScreenList = [];
        });
    }

    userChange() {
        const item = this.subscriberForm.get('userId').value;
        if (item.screenNumbers) {
            this.getScreensList(this.subscriberScreens, item.screenNumbers);
        } else {
            this.getScreensList(this.subscriberScreens);
        }
    }

    getScreensList(masterScreensList: string, userScreenList: string = '') {
        const arrayList = masterScreensList.split(',');
        _.forEach(arrayList, (row) => {
            const screen = _.find(this.commonService.masterScreensDataList, { 'id': row });
            if (screen) {
                if (userScreenList.indexOf(row) > -1) {
                    screen.isChecked = true;
                }
                this.masterScreenList.push(screen);
            }
        });
    }

    displayErrorMessages(field: string) {
        const control = this.subscriberForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    screenSelected(index) {
        this.masterScreenList[index].isChecked = !this.masterScreenList[index].isChecked;
    }

    save() {
        let selectedScreens = '';
        _.forEach(this.masterScreenList, (item) => {
            if (item.isChecked) {
                selectedScreens = selectedScreens === '' ? item.id : selectedScreens + ',' + item.id;
            }
        });
        const control = this.subscriberForm.get('userId').value;
        const object = {
            subscriberId: this.subscriberForm.get('subscriberID').value,
            userId: this.commonService.userDtls.userId,
            userTypeId: control.userTypeId,
            screenNumbers: selectedScreens,
            accessMasterId: control.accessMasterId
        };
        this.commonService.saveSubscribersUserScreens(object).subscribe((response) => {
            if (response.body.message === 'Access Record saved') {
                this.resetForm();
                this.commonService.triggerAlerts(
                    { message: 'Subscriber user screen list is saved', showAlert: true, isSuccess: true });
            }
        });
    }

    resetForm() {
        this.masterScreenList = [];
        this.subscriberScreens = '';
        this.subscriberForm.reset({
            subscriberID: '',
            userId: ''
        });
    }

    disableSave() {
        const selectedScreens = _.find(this.masterScreenList, { isChecked: true });
        return !(this.subscriberForm.valid && selectedScreens);
    }
}
