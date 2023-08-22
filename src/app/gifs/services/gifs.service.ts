import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagsHistory: string[] = [];

  private apiKey: string = 'uYQbHXZcxg55V2RNFaaE7c90OU9F6y09';
  private serviceURL: string = 'https://api.giphy.com/v1/gifs';
  public gifList: Gif[] = [];

  public get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  // TODO: Mi version cutre pero funcional
  // public loadLastSearch() {
  //   const tag: string = this._tagsHistory[0];
  //   const params = new HttpParams()
  //     .set('api_key', this.apiKey)
  //     .set('q', tag)
  //     .set('limit', '10');

  //   this.http.get<SearchResponse>(`${this.serviceURL}/search`, { params })
  //     .subscribe((resp) => {
  //       this.gifList = resp.data;
  //     });
  // }

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Loaded LocalStorage');
    // this.loadLastSearch();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    // Si el tag nuevo ya existe, entonces elimino el viejo
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');

    // Se manda el url de la api y los params como un objeto
    this.http.get<SearchResponse>(`${this.serviceURL}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
