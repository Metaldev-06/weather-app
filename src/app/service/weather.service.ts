import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DailyForecast, SearchLocationResponse } from '../interface/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private _apiKey = 'zAd7q1sZlhT4X4AtQcs6xh2E68rFCWkb';
  private _url = ('http://dataservice.accuweather.com/locations/v1/cities');
  private _urlWeather = ('http://dataservice.accuweather.com/forecasts/v1/daily/');
  private _urlWeatherActual = ('http://dataservice.accuweather.com/currentconditions/v1/');

  private _historial: string[] = [];
  public resultadoLocation : string = '';
  public resultadoWeather : DailyForecast[] = [];
  public resultadoWeatherActual : string = '';
  public location : string = '';

  constructor(private http: HttpClient) { 
    this.resultadoLocation = JSON.parse(localStorage.getItem('resultadosLocation')!) || [];
    this.resultadoWeather = JSON.parse(localStorage.getItem('resultadosWeather')!) || [];
    this.resultadoWeatherActual = JSON.parse(localStorage.getItem('resultadosWeatherActual')!) || [];
   }

  buscarLocation(location: string) {
    location = location.trim().toLowerCase();

    if (!this._historial.includes(location)) {
      this._historial.unshift(location);
      this._historial = this._historial.slice(0, 10);
    }

    const params = new HttpParams()
      .set('apikey', this._apiKey)
      .set('q', location)

    this.http.get<any>(`${this._url}/search`,{ params })
      .subscribe(resp => {
        // console.log(resp[0])
        this.resultadoLocation = resp[0].Key;
        localStorage.setItem('resultadosLocation', JSON.stringify(this.resultadoLocation));
        return this.resultadoLocation = this.resultadoLocation;
      })

      // console.log(this.resultadoLocation);
      this.buscarClima(this.resultadoLocation);
      this.buscarClimaActual(this.resultadoLocation)
    }

    buscarClima(a: any) {
      const params = new HttpParams()
      .set('apikey', this._apiKey)

      this.http.get<SearchLocationResponse>(`${this._urlWeather}5day/${a}`,{ params })
      .subscribe(resp => {
        this.resultadoWeather = resp.DailyForecasts;
        localStorage.setItem('resultadosWeather', JSON.stringify(this.resultadoWeather));
        // console.log(this.resultadoWeather);
        return this.resultadoWeather;
      })

    }

    buscarClimaActual(a: any) {
      const params = new HttpParams()
      .set('apikey', this._apiKey)

      this.http.get<any>(`${this._urlWeatherActual}${a}`,{ params })
      .subscribe(resp => {
        this.resultadoWeatherActual = resp[0].Temperature.Metric.Value;
        localStorage.setItem('resultadosWeatherActual', JSON.stringify(this.resultadoWeatherActual));
        // console.log(this.resultadoWeatherActual);
        return this.resultadoWeatherActual;
      })

    }
  }
