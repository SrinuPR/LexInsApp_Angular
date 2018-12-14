import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    constructor() {}

    setSession(object) {
        sessionStorage.setItem('userDetails', JSON.stringify(object));
    }

    getSession() {
        const userDetails = sessionStorage.getItem('userDetails');
        return JSON.parse(userDetails);
    }
}
