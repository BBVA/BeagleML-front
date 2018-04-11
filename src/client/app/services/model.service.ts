import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/config/env.config';
// import 'rxjs/add/operator/do';  // for debugging

import { Model } from '../models/model';

/**
 * This class provides the Model service
 */
@Injectable()
export class ModelService {

  //Endpoint URL
  private apiURL = `${Config.DOMAIN}` + `${Config.API}`;

  /**
   * Creates a new ModelService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Get a list of project-configs
   *
   * @return {Model[]} The Observable for the HTTP request.
   */
  get(): Observable<Model[]> {
    const url = `${this.apiURL}models`;
    return this.http.get(url)
      .map((res: Response) => {
        const rows = [];
        let properties = ['pool', 'queue', 'completed', 'timeout', 'accuracy_limit_reached', 'stopped'];
        for( let row of res.json()){
          row['id'] = row['id'] ? row['id'] : row['_id'];
          row.total = 0;
          properties.map((prop) => row.total += row[prop] || 0);
          rows.push(row);
        }
        return rows as Model[];
      })
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }


  /**
   * Add new model to Database
   *
   * @return The Observable for the HTTP request.
   */
  add(body: any): Observable<Model[]> {
    const url = `${this.apiURL}models`;
    return this.http
      .post(url, body)
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
