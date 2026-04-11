import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Product } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient) {}
  httpBase = `https://api.everrest.educata.dev/`;
  getAll(url: string) {
    return this.http.get<Product[]>(this.httpBase + url);
  }
  postAll(url: string, body : any) {
    return this.http.post(this.httpBase + url, body)
  }
  getAllHeader(url: string, p0: { headers: { Authorization: string; }; }){
    return this.http.get(this.httpBase + url, {
      headers : {
          "Authorization" : `Bearer ${localStorage.getItem('access_token')} `
    }})
  }
  patchData(url: string, body: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch(this.httpBase + url, body, { headers });
  }
}