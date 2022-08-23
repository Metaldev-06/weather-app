import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/service/weather.service';

@Component({
  selector: 'app-next-content',
  templateUrl: './next-content.component.html',
  styleUrls: ['./next-content.component.scss']
})
export class NextContentComponent {

  get resultadoWeather() {
    return this.weatherService.resultadoWeather;
  }
  constructor(private weatherService: WeatherService) { }

}
