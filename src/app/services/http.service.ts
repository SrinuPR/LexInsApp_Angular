import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable()

export class HttpService {

  constructor(
    private http: HttpClient
  ) {}
  path = 'http://USHYDRNARNE8:8888/';
  private headers = new HttpHeaders({
    'Pragma': 'no-cache',
    'cache-control': 'no-cache',
    'content-type': 'application/json'
  });

  get(url: string, body?: any) : Observable<any> {
    let fullURL = this.path + url;
    if (body) {
      fullURL = fullURL + body;
    } 
    return this.http.get(fullURL , { observe: 'response', headers: this.headers });
  }

  post(url: string, body: object): Observable<any> {
    return this.http.post(this.path + url, body, { observe: 'response', headers: this.headers });
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(this.path + url + body, { observe: 'response', headers: this.headers });
  }
}
