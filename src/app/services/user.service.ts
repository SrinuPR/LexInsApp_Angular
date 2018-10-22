import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserType } from '../interfaces/user-type';

@Injectable()
export class UserService {

    userType: UserType;

    constructor (public httpService: HttpService) {
        this.userType = {};
    }

    createorUpdateUserType(usertype: UserType) {
        return this.httpService.post('usertype/create', usertype);
    }

    validateUserType(userType: UserType) {
        return this.httpService.post('usertype/validate/', userType);
    }

}
