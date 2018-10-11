import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberService } from 'src/app/services/subscriber.service';
import { Subscriber } from 'src/app/interfaces/subscriber';

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
        public subscriberService: SubscriberService
    ) { }
    ngOnInit() {
        this.buildFormControls();
    }
  
    buildFormControls() {
      this.subscriberForm = this.formBuilder.group({
        subscriberID: new FormControl('', {
          validators: [Validators.required, 
          ValidateSubscriberUnique.validateSubscriberId(this.subscriberService)],
          updateOn: 'blur'}),
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
      this.subscriberService.validateSubscriberId(this.subscriberForm.get('subscriberID').value).subscribe((response) => {
        console.log(response);
      });
    }

    createOrUpdateSubscriber() {
      this.subscriberService.createOrUpdateSubscriber(this.mapSubscriber()).subscribe((response) => {
        console.log(response);
      });
    }

    mapSubscriber(): Subscriber {
      return <Subscriber> {
        subscriberId: this.subscriberForm.get('subscriberID').value,
        subscriberName: this.subscriberForm.get('subscriberName').value,
        subscriberAddress: this.subscriberForm.get('subscriberAddress').value /*,
        createdBy: this.subscriberForm.get('subscriberID').value, */
      };
    }
}

export class ValidateSubscriberUnique {
  static validateSubscriberId(subscriberService: SubscriberService) {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return subscriberService.validateSubscriberId(control.value)
        .subscribe(response => {
          console.log('resp', response);
          //return response === 'Subscriber ID already exists' ? {subIdNotUnique: true}: null;
        });
    }
  }
}
