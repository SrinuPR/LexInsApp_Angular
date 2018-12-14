import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserDetailsModel {
    public userId: string;
    public password: string;
    public userName: string;
    public subscriberId: number;
    public subscriberName: string;
    public status: string;
    public errorMessage: string;
    public firstTimeLogin: boolean;
    public isAdmin: string;
}
