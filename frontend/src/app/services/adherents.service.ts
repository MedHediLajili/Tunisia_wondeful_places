import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adherent } from '../models/adherent';
@Injectable({
  providedIn: 'root'
})
export class AdherentsService {
  url = 'http://127.0.0.1:8000/api' ;
  constructor(private http: HttpClient) { }

  getAllAdherent(): Observable<Adherent[]> {
  return this.http.get<Adherent[]>(`${this.url}/adherents`);
  }
  updateAdherent(adherent: Adherent , tokenIn: string): Observable<Adherent> {
    return this.http.put<Adherent>(`${this.url}/editadherent/${adherent.id}`, {firstname: adherent.firstname, photo: adherent.photo,
      lastname: adherent.lastname, email: adherent.email, description: adherent.description, password: adherent.password , token: tokenIn});
  }

  deleteAdherent(adherentid: string): Observable<null> {
    return this.http.delete<null>(`${this.url}/deleteadherent/${adherentid}`);
  }
  register(adherent: Adherent): Observable<any> {
    return this.http.post<any>(`${this.url}/adherent/register`, adherent);
  }
  login(adherent: Adherent): Observable<any> {
    return this.http.post<any>(`${this.url}/adherent/login`, adherent );
  }
  logout(tokenIn: string): Observable<any> {
    return this.http.post<any>(`${this.url}/adherent/logout`, {token: tokenIn});
  }
  adherentInfos(tokenIn: string): Observable<Adherent> {
    return this.http.post<Adherent>(`${this.url}/adherent/authadherent`, {token: tokenIn});
   }
   verifEmailAdherent(codeIn: string, firstname: string , lastname: string, email: string): Observable<null> {
     return this.http.post<null>(`${this.url}/sendemail/send`, {firstname, lastname, email, code: codeIn});
   }
}
