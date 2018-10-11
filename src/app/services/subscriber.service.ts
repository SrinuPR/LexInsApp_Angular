import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Subscriber } from '../interfaces/subscriber';

@Injectable()
export class SubscriberService {

    constructor (public httpService: HttpService) { }

    validateSubscriberId(subName: number) {
        return this.httpService.get('subscriber/', subName);
    }

    createOrUpdateSubscriber(subscriber: Subscriber) {
        return this.httpService.post('subscriber/create', subscriber)
            .map((response) => {
                console.log(response);
            });
    }

}