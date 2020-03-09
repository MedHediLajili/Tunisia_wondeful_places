import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../models/place';
import { FormGroup } from '@angular/forms';
import { State } from '../models/state';
import { TokensService } from './tokens.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  url = 'http://127.0.0.1:8000/api';
  tokenAll: string;
  constructor(private http: HttpClient, private tokenservice: TokensService) {
    this.tokenAll = this.tokenservice.getToken();
   }

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.url}/places`);
  }
  addPlace(idstate: string , place: Place): Observable<Place> {
    return this.http.post<Place>(`${this.url}/state/${idstate}/addplace`, { place , token: this.tokenAll});
  }
  updatePlace(placeid: string, place: Place): Observable<Place> {
   return this.http.put<Place>(`${this.url}/state/updateplace/${placeid}` , { place , token: this.tokenAll});
  }
  Clean(form: FormGroup ) {
    form.get('name').setValue('');
    form.get('description').setValue('');
  }
  deletePlace(placeid: string): Observable<null> {
   return this.http.post<null>(`${this.url}/state/removeplace/${placeid}`, {token: this.tokenAll} );
  }
}
