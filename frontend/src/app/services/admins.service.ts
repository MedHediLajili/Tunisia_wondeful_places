import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin';
import { TokensService } from './tokens.service';
@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  url = 'http://127.0.0.1:8000/api';
  tokenAll: string;
  constructor(private http: HttpClient, private tokenservice: TokensService) {
    this.tokenAll = this.tokenservice.getToken();
   }

  login(admin: Admin): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/login`, admin );
  }
  register(admin: Admin): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/register`, admin );
  }

  adminInfos(tokenIn: string): Observable<Admin> {
   return this.http.post<Admin>(`${this.url}/admin/authadmin`, {token: tokenIn});
  }
  logout(tokenIn: string): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/logout`, {token: tokenIn});
  }

  updateAdmin(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.url}/editadmin/${admin.id}`, {admin , token: this.tokenAll });

}
}
