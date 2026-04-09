import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}}