import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokensService } from './tokens.service';
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  url = 'http://127.0.0.1:8000/api';
  tokenAll: string;

  constructor(private http: HttpClient, private tokenservice: TokensService) {
    this.tokenAll = this.tokenservice.getToken();
   }

   getAdherentCollections(adherentid: string ): Observable<Collection[]> {
    return this.http.post<Collection[]>(`${this.url}/adherent/${adherentid}/collections`, {token: this.tokenAll});
    }
    addCollection(collection: Collection , adherentid: string ): Observable<Collection> {
      return this.http.post<Collection>(`${this.url}/adherent/${adherentid}/addcollection`, {collection , token: this.tokenAll});
    }
    addPlaceToCollection(collectionid: string , placeid: string): Observable<any> {
      return this.http.post<any>(`${this.url}/adherent/collection/${collectionid}/addplace/${placeid}`, {token: this.tokenAll});
    }
    getAllPlacesOfCollection(collectionid: string): Observable<Place[]> {
      return this.http.post<Place[]>(`${this.url}/adherent/collection/${collectionid}/allplaces`, {token: this.tokenAll});
    }
    getInformationOfCollection(collectionid: string): Observable<Collection> {
      return this.http.post<Collection>(`${this.url}/adherent/collection/${collectionid}`, {token: this.tokenAll});
    }
    updateCollection(collection: Collection): Observable<Collection> {
      return this.http.put<Collection>(`${this.url}/adherent/updatecollection/${collection.id}`, {collection , token: this.tokenAll});
    }
    deleteCollection(collectionid: string): Observable<null> {
      return this.http.post<null>(`${this.url}/adherent/removecollection/${collectionid}`, { token: this.tokenAll});
    }
    removePlaceFromCollection(collectionid: string , placeid: string ): Observable<null> {
      return this.http.post<null>(`${this.url}/adherent/collection/${collectionid}/removeplace/${placeid}`, { token: this.tokenAll});
    }

  Clean(collection: Collection) {
    collection.name = null;
   }
}
