import { Component } from '@angular/core';
import { WeatherService } from '../../service/weather.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent {

  get resultadoWeather() {
    return this.weatherService.resultadoWeather;
  }
  get resultadoWeatherActual() {
    return this.weatherService.resultadoWeatherActual;
  }
  constructor(private weatherService: WeatherService) { }

gradosAVG = this.weatherService?.resultadoWeatherActual;
gradosMin = this.weatherService.resultadoWeather[0]?.Temperature.Minimum.Value;
gradosMax = this.weatherService.resultadoWeather[0]?.Temperature.Maximum.Value;

clima = this.weatherService.resultadoWeather[0]?.Day.IconPhrase;
fechaActual = this.weatherService.resultadoWeather[0]?.Date;
}
