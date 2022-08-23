import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';  
@Pipe({
  name: 'fecha'
})
export class FechaPipe extends DatePipe implements PipeTransform {

  override transform(value: any, args?: any): any {
    return super.transform(value, " d-MM-y");
  }

}
