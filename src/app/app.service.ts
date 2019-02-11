import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

export class Image {
  constructor(
    public ID: number,
    public image: string) { }
}

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(public http: HttpClient) { }

  public uploadImage(
    images: Image[],
  ) {
    const postData = new FormData();
    for (const i of images) {
      postData.append('images', i.image);
    }
    return this.http.post(API_URL + 'upload/image', postData, this.getOptions()).pipe(map(res => res));
  }

  private getOptions() {
    const authToken = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + authToken
      })
    };
  }

}
