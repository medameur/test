import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {
  apiKey = '886705b4c1182eb1c69f28eb8c520e20';
  url;


  constructor(
    public http: Http,
    private geolocation: Geolocation
  ) {
    console.log('Hello WeatherProvider Provider');

  }
  async getPosition() {
    return await this.geolocation.getCurrentPosition();
  } 

  currentWeather(lon: number, lat: number): Observable<any> {
    const currentInfo = this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${this.apiKey}`);
    const forecastInfo = this.http.get(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=metric&cnt=10&APPID=${this.apiKey}`);

    return Observable.forkJoin([currentInfo,forecastInfo])
      .map(responses => {
        return [].concat(...responses);
      });
  }

}
