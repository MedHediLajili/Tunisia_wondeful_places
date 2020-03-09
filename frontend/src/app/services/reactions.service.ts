import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction } from '../models/reaction';
import { TokensService } from './tokens.service';


@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  url = 'http://127.0.0.1:8000/api';
  tokenAll: string;
  constructor(private http: HttpClient, private tokenservice: TokensService) {
    this.tokenAll = this.tokenservice.getToken();
   }

  getAdherentReactions(adherentid: string ): Observable<Reaction[]> {
  return this.http.post<Reaction[]>(`${this.url}/adherent/${adherentid}/reactions`, {token: this.tokenAll});
  }
  addReaction(reaction: Reaction , adherentid: string ): Observable<Reaction> {
    // tslint:disable-next-line: max-line-length
    return this.http.post<Reaction>(`${this.url}/adherent/${adherentid}/addreaction`, { reaction , token: this.tokenAll});
  }
  updateReaction(reaction: Reaction): Observable<Reaction> {
    return this.http.put<Reaction>(`${this.url}/adherent/updatereaction/${reaction.id}`, {reaction , token: this.tokenAll});
  }
  deleteReaction(reaction: Reaction): Observable<null> {
    return this.http.post<null>(`${this.url}/adherent/removereaction/${reaction.id}`, { token: this.tokenAll});
  }
  checkReactedTo(adherentid: string , placeid: string): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.url}/adherent/${adherentid}/reaction/${placeid}`, { token: this.tokenAll});
  }

}
