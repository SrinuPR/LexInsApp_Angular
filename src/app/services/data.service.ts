import { Injectable } from '@angular/core';
import { SubscriberDetails } from '../interfaces/subscriber-details';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  subsrciberDetails: SubscriberDetails = {
      subscriberId: 1,
      subscriberName: 'New administrator'
  };
  constructor( ) { }

}
