import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { Subscriber } from 'src/app/interfaces/subscriber';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})

export class SubscriberComponent implements OnInit {
  subscriberForm: FormGroup;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public subscriberService: SubscriberService,
    private commonService: CommonService
  ) { }
  ngOnInit() {
    this.buildFormControls();
  }

  buildFormControls() {
    this.subscriberForm = this.formBuilder.group({
      subscriberID: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      subscriberName: new FormControl('', [Validators.required]),
      subscriberAddress: new FormControl('', [Validators.required])
    });
  }

  displayErrorMessages(field: string) {
    const control = this.subscriberForm.get(field);
    if (control) {
      return (control.touched && control.invalid);
    }
    return false;
  }

  verifySubscriber() {
    const control = this.subscriberForm.get('subscriberID');
    if (control.value && control.value.length > 0) {
      this.subscriberService.validateSubscriberId(control.value).subscribe((response) => {
        const status = response.body.message;
        if (status === `Subscriber ID doesn't exist`) {
          control.setErrors(null);
        } else {
          control.setErrors({'subIdNotUnique': true });
        }
      });
    }
  }

  createOrUpdateSubscriber() {
    this.subscriberService.createOrUpdateSubscriber(this.mapSubscriber()).subscribe((response) => {
      console.log(response);
      const result = response.body;
      if (result.status === 'Success' && result.message === 'Subscriber Saved') {
        console.log('Subscriber saved successfully');
        this.commonService.triggerAlerts(
          { message: 'Subscriber details saved successfully', showAlert: true, isSuccess: true });
      }
    });
  }

  mapSubscriber(): Subscriber {
    return <Subscriber>{
      subscriberId: Number(this.subscriberForm.get('subscriberID').value),
      subscriberName: this.subscriberForm.get('subscriberName').value,
      subscriberAddress: this.subscriberForm.get('subscriberAddress').value,
      createdBy: this.commonService.userDtls.userName
    };
  }
}

export class ValidateSubscriberUnique {
  static validateSubscriberId(subscriberService: SubscriberService) {
    return (control: AbstractControl) => {
      if (control.value == null || !control.touched || !control.dirty) {
        console.log(control.value);
        return null;
      }
      return subscriberService.validateSubscriberId(control.value).subscribe((response): ValidationErrors | null => {
        const status = response.body.message;
        return status === `Subscriber ID doesn't exist` ? null : { 'subIdNotUnique': true };
      });
    };
  }
}
