import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/config/env.config';
// import 'rxjs/add/operator/do';  // for debugging

import { Experiment } from '../models/experiment';

/**
 * This class provides the Model service
 */
@Injectable()
export class PoolService {

  //Endpoint URL
  private apiURL = `${Config.DOMAIN}` + `${Config.API}`;

  /**
   * Creates a new HighlightService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Get a list of project-configs
   *
   * @return {Model[]} The Observable for the HTTP request.
   */
  get(): Observable<Experiment[]> {
    const url = `${this.apiURL}pools`;
    return this.http.get(url)
      .map((res: Response) => {
        const rows = [];
        for( let row of res.json()){
          if (row) {
            row['id'] = row['id'] ? row['id'] : row['_id'];
            rows.push(row);
          }
        }
        return rows as Experiment[];
      })
      //.do(data => console.log('server data:', data))  // debug
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
