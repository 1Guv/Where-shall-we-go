import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<Data>('/assets/venue.json');
  }
}
