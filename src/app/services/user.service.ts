import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class UserService {

    constructor (public httpService: HttpService) { }

    createUser() {
        // return this.httpService.post('user/login', body)
        //     .subscribe((response) => {
        //         console.log(response);
        //     });
    }

    createUserType() {
        //return this.httpService.post('subscriber/create', subscriber);
    }

    validateUserTypeId(userTypeId: number) {
        //return this.httpService.get('subscriber/', userTypeId);
    }

}