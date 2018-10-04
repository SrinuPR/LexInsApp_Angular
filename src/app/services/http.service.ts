import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(public http: HttpClient) { }

  getBody(object = {}) {
    return {
        body: {
            id: '17',
            method: '',
            params: [object],
            jsonrpc: '2.0'
        }
    };
  }
  
  post(path, body) {
    const url = 'http://10.8.76.37:8888/'
    this.http.post(url + path, body, httpOptions)
    .subscribe(
      (response) => { console.log(response); }, // success path
      (error) => { console.log(error); } // error path
    );
  }

  get(path) {
    const url = 'https://ot1.guidehome.com/mt/engageportalservices/v1/cache/metadata/questions/'
    this.http.post(url + path, this.getBody(), httpOptions)
    .subscribe(
      (response) => { console.log(response); }, // success path
      (error) => { console.log(error); } // error path
    );
  }

}
