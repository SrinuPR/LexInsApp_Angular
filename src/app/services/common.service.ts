import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  constructor(
    public httpService: HttpService,
    public http: HttpClient
  ) { }

  userLogin1() {
    const body = {
      userId:1111,
      password: 'Srinu123'
    }
    this.httpService.post('user/login', body);
  }

  userLogin() {
    const body = {
      userId:1111,
      password: 'Srinu123'
    }
    this.httpService.post('bp7appetitequestions?hard_refresh=true', body);
  }
}
