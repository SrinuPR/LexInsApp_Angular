import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class RouterGuardService implements CanActivate {
    constructor (private commonService: CommonService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.commonService.clearAlerts();
        return true;
    }
}
