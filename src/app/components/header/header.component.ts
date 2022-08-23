import { Component, ElementRef, ViewChild } from '@angular/core';
import { WeatherService } from '../../service/weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent{
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  constructor(private weather: WeatherService) { }

  buscar() {
    const valor = this.txtBuscar.nativeElement.value;
    console.log(valor);
    if (valor.trim().length === 0) {
      return;
    }
    this.weather.buscarLocation(valor)
    this.txtBuscar.nativeElement.value = '';
  }

}
