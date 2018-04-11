import { Injectable } from '@angular/core';
import { Http, Response, RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/config/env.config';
import 'rxjs/add/operator/do';  // for debugging

import { System } from '../models/system';

/**
 * This class provides the System service
 */
@Injectable()
export class SystemService {

  body: any;

  //Endpoint URL
  private apiURL = `${Config.DOMAIN}` + `${Config.API}`;
  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: Http) {
  }


  /**
   * Get data from the system
   *
   * @return {data{}} The Observable for the HTTP request.
   */
  getSystem(id: string): Observable<System> {
    const url = `${this.apiURL}systems/${id}`;

    return this.http.get(url)
      .do((res) => { if(res) this.body = res; })
      .catch(this.handleError);
  }

  /**
   * Get a list of system
   *
   * @return {System[]} The Observable for the HTTP request.
   */
  getSystems(): Observable<System[]> {
    const url = `${this.apiURL}systems`;
    return this.http.get(url)
      .map((res: Response) => {
        const systemsList = [];
        let properties = ['pool', 'queue', 'completed', 'timeout', 'accuracy_limit_reached', 'stopped'];
        for( let system of res.json() ){
          system['id'] = system['id'] ? system['id'] : system['_id'];
          system.total = 0;
          properties.map((prop) => system.total += system[prop] || 0);
          systemsList.push(system);
        }
        return systemsList as System[];
      })
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }

  /**
   * System Reset
   *
   * @return The Observable for the HTTP request.
   */
  reset(id: string): Observable<System[]> {
    const url = `${this.apiURL}systems/${id}/reset`;

    return this.http
      .post(url, {})
      .do((response: any) => console.log(response))
      .catch(this.handleError);
  }

  /**
   * System Play
   *
   * @return The Observable for the HTTP request.
   */
  play(id: string): Observable<System[]> {
    let body = {
      running: true
    };

    const url = `${this.apiURL}systems/${id}`;

    return this.http
      .put(url, body)
      .do((response) => console.log(response))
      .catch(this.handleError);
    }

  /**
   * System Stop
   *
   * @return The Observable for the HTTP request.
   */
  stop(id: string): Observable<System[]> {
    let body = {
      running: false
    };

    const url = `${this.apiURL}systems/${id}`;

    return this.http
      .put(url, body)
      .do((response) => console.log(response))
      .catch(this.handleError);
  }

  /**
   * System Update
   *
   * @return The Observable for the HTTP request.
   */
  update(id: string, body: any): Observable<System[]> {
    this.body = body;
    const url = `${this.apiURL}systems/${id}`;

    return this.http
      .put(url, this.body)
      .do((response: any) => {
        console.log(response);
      })
      .catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
