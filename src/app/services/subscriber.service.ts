import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Subscriber } from '../interfaces/subscriber';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriberService {

    allSubscribers: Subscriber[];

    constructor(public httpService: HttpService) { }

    validateSubscriberId(subName: number): Observable<any> {
        return this.httpService.get('subscriber/', subName);
    }

    createOrUpdateSubscriber(subscriber: Subscriber) {
        return this.httpService.post('subscriber/create', subscriber);
    }

    getAllSubscribers() {
        this.httpService.get('subscriber/all').subscribe((response) => {
            this.allSubscribers = response.body.subMasterList;
        });
    }

}
