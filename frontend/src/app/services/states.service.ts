import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state';
import { TokensService } from './tokens.service';
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  url = 'http://127.0.0.1:8000/api';
  tokenAll: string;
  constructor(private http: HttpClient, private tokenservice: TokensService) {
    this.tokenAll = this.tokenservice.getToken();
   }

  getAllStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.url}/states`);
  }

  addState(state: State): Observable<State> {
    return this.http.post<State>(`${this.url}/newstate`, {state , token: this.tokenAll});
  }

  updateState(state: State): Observable<State> {
    return this.http.put<State>(`${this.url}/editstate/${state.id}`, {state , token: this.tokenAll});
  }

  removeState(stateid: string): Observable<any> {
   return this.http.post<any>(`${this.url}/deletestate/${stateid}`, {token: this.tokenAll});
  }

  getState(stateid: string): Observable<State> {
    return this.http.get<State>(`${this.url}/state/${stateid}`);
  }

  getPlacesOfState(stateid: string): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.url}/state/${stateid}/places`);
  }

  Clean(state: State) {
   state.name = null;
   state.description = null;
  }
}
