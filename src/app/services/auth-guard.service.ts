import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class AuthGuard implements CanActivateChild{

    constructor(public auth:AuthService){}
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean{
            if(this.auth.isAuthenticated()){
                return true;
            }
            else{
                return false;
            }
        }

        canActivateChild(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): boolean{
                return this.canActivate(route,state);
            }
}