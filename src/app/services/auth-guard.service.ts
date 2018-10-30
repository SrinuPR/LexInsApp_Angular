import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

    constructor(public auth: AuthService, private commonService: CommonService) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            this.commonService.clearAlerts();
            if (this.auth.isAuthenticated()) {
                return true;
            }
            return false;
        }

        canActivateChild(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): boolean {
            return this.canActivate(route, state);
        }
}
