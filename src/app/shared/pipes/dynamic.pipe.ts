import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamic'
})
export class DynamicPipe implements PipeTransform {

  public constructor(private injector: Injector) {}

  transform(value: any, pipeToken: any, args: any[]): any {
    if (!pipeToken) {
      return value;
    }

    let pipe = this.injector.get(pipeToken);
    return pipe.transform(value, ...args);
  }

}
