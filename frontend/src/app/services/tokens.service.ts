import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  constructor() { }

  setToken(token: string) {
   localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }

  getpayload() {
   const payload = JSON.parse(atob(this.getToken().split('.')[1]));
   return payload ;
  }
}
