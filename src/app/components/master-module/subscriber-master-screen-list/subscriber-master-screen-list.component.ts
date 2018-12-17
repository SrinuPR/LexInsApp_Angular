import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubscriberService } from 'src/app/services/subscriber.service';
import * as _ from 'underscore';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-subscriber-master-screen-list',
    templateUrl: './subscriber-master-screen-list.component.html',
    styleUrls: ['./subscriber-master-screen-list.component.scss']
})

export class SubscriberMasterScreenListComponent implements OnInit {
    subscriberForm: FormGroup;
    subscribersList = [];
    selectedScreenList = [];
    masterScreenList = [];

    constructor(
        private formBuilder: FormBuilder,
        public subscriberService: SubscriberService,
        public commonService: CommonService
    ) { }
    ngOnInit() {
        this.getSubscribersList();
        this.subscriberForm = this.formBuilder.group({
            subscriberID: new FormControl('', [Validators.required])
        });
    }

    subscriberChange() {
        this.masterScreenList = this.commonService.deepCopy(this.commonService.masterScreensDataList);
        this.subscriberService.getMasterScreenList(this.subscriberForm.get('subscriberID').value).subscribe((response) => {
            if (response.body.message === 'Screen List Success' && response.body.results !== null) {
                _.forEach(this.masterScreenList, (item) => {
                    const savedScreen = _.find(response.body.results, { 'screenNumber': item.id });
                    if (savedScreen) {
                        item['masterListId'] = savedScreen.masterListId;
                        item.isChecked = true;
                    }
                });
            }
        });
    }

    getSubscribersList() {
        this.subscriberService.getAllSubscribersLst().subscribe((response) => {
            this.subscribersList = response.body.subMasterList;
        });
    }

    displayErrorMessages(field: string) {
        const control = this.subscriberForm.get(field);
        if (control) {
            return (control.touched && control.invalid);
        }
        return false;
    }

    screenSelected(event, index) {
        this.masterScreenList[index].isChecked = !this.masterScreenList[index].isChecked;
    }

    createOrUpdateSubscriber() {
        const requestBody = [];
        _.forEach(this.masterScreenList, (item) => {
            const object = {
                subscriberId: this.subscriberForm.get('subscriberID').value,
                userId: this.commonService.userDtls.userId,
                screenName: item.displayText,
                screenNumber: item.id,
                selected: item.isChecked,
                masterListId: item.masterListId || null
            };
            requestBody.push(object);
        });
        this.commonService.saveSubscriberScreens(requestBody).subscribe((response) => {
            if (response.body.message === 'Screen Assignment saved') {
                this.resetForm();
                this.commonService.triggerAlerts(
                    { message: 'Subscriber master screen list is saved', showAlert: true, isSuccess: true });
            }
        });
    }

    resetForm() {
        this.masterScreenList = [];
        this.selectedScreenList = [];
        this.subscriberForm.reset({
            subscriberID: ''
        });
    }

    disableSave() {
        const selectedScreens = _.find(this.masterScreenList, { isChecked: true });
        return !(this.subscriberForm.valid && selectedScreens);
    }
}
