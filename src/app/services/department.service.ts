import { Pagination } from './../modals/Pagination';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Department } from '../modals/Deparment';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  token = localStorage.getItem('TOKEN');
  constructor(private http: HttpClient) { }
  getDepartment(): Observable<Pagination<Department>> {
    var reqHeader = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<Pagination<Department>>(`https://localhost:44359/api/Departments`,{ headers: reqHeader });
  }
}
