import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  constructor(public router: Router, public http: HttpClient) { }

  userLogin() {
    const body = {
      userId:1111,
      password: 'Srinu123'
    }
    this.http.post('http://10.8.76.37:8888/user/login', body, httpOptions)
    .subscribe(
      (response) => { console.log(response); }, // success path
      (error) => { console.log(error); } // error path
    );
  }
}
