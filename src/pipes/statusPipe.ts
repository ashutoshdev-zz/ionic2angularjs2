import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'statuses',
  pure: false,
})
export class StatusPipe implements PipeTransform {
  transform(value) : any {
    var statuses = {};
    value.forEach(function(o) {
      var status = o.status;
      if(status === 'pending') {
        status = 'new orders';
      }else if (status === 'vendor-accepted' || status === 'driver-accepted'){
        status = 'accepted';
      }else {
        status = 'delivering';
      }
      statuses[status] = statuses[status] ? statuses[status] : { name: status, resources: [] };
      statuses[status].resources.push(o);
    });

    return Object.keys(statuses).map(function (key) {return statuses[key]});
  }
}


