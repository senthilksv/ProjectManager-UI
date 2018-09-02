import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskmgrSearch'
})
export class TaskmgrSearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
