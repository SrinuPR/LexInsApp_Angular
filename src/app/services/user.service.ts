import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserType } from '../interfaces/user-type';
import { User } from '../interfaces/user';

@Injectable()
export class UserService {

    userType: UserType;
    allUserTypes: UserType[];

    constructor (public httpService: HttpService) {
        this.userType = {};
    }

    createorUpdateUserType(usertype: UserType) {
        return this.httpService.post('usertype/create', usertype);
    }

    validateUserType(userType: UserType) {
        return this.httpService.post('usertype/validate/', userType);
    }

    getAllApplicableUserTypes(subscriberId: number) {
        return this.httpService.get('user/types/' + subscriberId);
    }

    createOrUpdateUser(user: User) {
        return this.httpService.post('user/create', user);
    }

    validateUserId(userId: number) {
        return this.httpService.get('user/validate/' + userId);
    }

}
