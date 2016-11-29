import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import { config } from '../config/config';
import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
/**
 * Class GinjaHttpClient A http client class for ginja ai calls.
 * @constructor
 */
export class GinjaHttpClient {

    constructor(public http: Http) {
        this.http = http;
    }

    getHeaders() {
      let headers = new Headers();
      // @todo: add authorization header(s)
      return headers;
    }

    login(data): Observable<Response> {
      let url: string = config.apiEndPoint + '/api/v2/oauth/access_token';
      // @todo: implement call
      return new Observable;
    }

    fetchOrders(page, type): Observable<Response> {
      let url: string = config.apiEndPoint + '/api/v2/vendor/orders/' + type;
      // @todo: implement call
      return new Observable;
    }

    vendorDetails(): Observable<Response> {
      let url: string = config.apiEndPoint + '/api/v2/vendor';
      // @todo: implement call
      return new Observable;
    }
}
