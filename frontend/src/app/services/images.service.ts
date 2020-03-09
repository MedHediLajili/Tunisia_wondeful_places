import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Image} from '../models/image';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  url = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) { }

  saveImage(formdata) {
   return this.http.post(`${this.url}/addimage`, formdata);
  }
  deleteImage(name: string , dossier: string) {
    return this.http.post(`${this.url}/deleteimage`, {photo: name , folder: dossier } );
   }

  addImageToPlace(idplace: string , photoname: string): Observable<Image> {
    return this.http.post<Image>(`${this.url}/place/${idplace}/addimage`, {image: photoname});
   }

  getAllImagesOfPlace(placeid: string): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.url}/place/${placeid}/images`);
  }
}
