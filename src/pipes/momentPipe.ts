import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'moment',
    pure: false,
})
/**
 * Class MomentPipe A custom pipe for showing time.
 * @constructor
 */
export class MomentPipe implements PipeTransform {
    transform(d:Date | moment.Moment, args?:any[]):string {
        let rv = moment(d).format(args[0]);
        return rv;
    }
}