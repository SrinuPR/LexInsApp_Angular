import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient
  ) {}
  path = 'http://10.8.76.40:8888/';
  private headers = new HttpHeaders({
    'Pragma': 'no-cache',
    'cache-control': 'no-cache',
    'content-type': 'application/json'
  });

  get(url: string, body?: any): Observable<any> {
    let fullURL = this.path + url;
    if (body) {
      fullURL = fullURL + body;
    }
    return this.http.get(fullURL , { observe: 'response', headers: this.headers });
  }

  post(url: string, body: object): Observable<any> {
    return this.http.post(this.path + url, body, { observe: 'response', headers: this.headers });
  }

  async post1(path, body) {
    let res = null;
    await this.http.post(this.path + path, body, httpOptions)
    .toPromise().then(
      response => { console.log(response);
       res = response;
      }, // success path
      (error) => { console.log(error);
        res = error.error;
      } // error path
    );
    return res;
  }
  //10.14.224.30:8888/user/changePass 
   /* async post1(path, body) {
     let res = null;
     //const url = 'http://10.8.76.59:8888/';
     const url = 'http://localhost:8888/';
     await this.http.post(url + path, body,httpOptions)
     .toPromise().then(
       response => { console.log(response); 
        res = response;
       }, // success path
       (error) => { console.log(error); 
         res = error.error;
       } // error path
     );
     return res;
   } */

  put(url: string, body: any): Observable<any> {
    return this.http.put(this.path + url + body, { observe: 'response', headers: this.headers });
  }
}
