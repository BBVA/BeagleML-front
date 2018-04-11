import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/config/env.config';
// import 'rxjs/add/operator/do';  // for debugging

import { Project } from '../models/project';
import { Experiment } from '../models/experiment';

/**
 * This class provides the Projects service
 */
@Injectable()
export class ProjectService {

  //Endpoint URL
  private apiURL = `${Config.DOMAIN}` + `${Config.API}`;

  /**
   * Creates a new ProjectService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Add new project to Database
   *
   * @return The Observable for the HTTP request.
   */
  add(body: any): Observable<Project[]> {
    const url = `${this.apiURL}projects`;
    return this.http
      .post(url, body)
      .do((response: any) => {
        console.log(response);
      })
      .catch(this.handleError);
  }
  /**
   * Get a project detail
   *
   * @return {Project[]} The Observable for the HTTP request.
   */
  getProject(id: string): Observable<Project> {
    const url = `${this.apiURL}projects/${id}`;
    return this.http.get(url)
      .map((res: Response) => {
        const project = res.json();
        project['id'] = project['id'] ? project['id'] : project['_id'];
        return project as Project;
      })
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }

  removeExperimentsFromProject(id: string): Observable<Project> {
    const url = `${this.apiURL}projects/${id}`;
    return this.http.delete(url)
      .catch(this.handleError);
  }

  /**
   * Get a list of project
   *
   * @return {Project[]} The Observable for the HTTP request.
   */
  getProjects(): Observable<Project[]> {
    const url = `${this.apiURL}projects`;
    return this.http.get(url)
      .map((res: Response) => {
        const projectsList = [];
        let properties = ['pool', 'queue', 'completed', 'timeout', 'accuracy_limit_reached', 'stopped'];
        for( let project of res.json() ){
          project['id'] = project['id'] ? project['id'] : project['_id'];
          project.total = 0;
          properties.map((prop) => project.total += project[prop] || 0);
          projectsList.push(project);
        }
        return projectsList as Project[];
      })
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }

  /**
   * TODO: Paging is not implemented
   *
   * @param id
   * @return {Observable<R|T>}
   */
  getExperimentsByProjectId(id: string): Observable<any[]> {
    const url = `${this.apiURL}projects/${id}/experiments?offset=0&limit=10000`;
    return this.http.get(url)
      .map((res: Response) => {
        const expList = [];
        for( let exp of res.json().info.experiments ){
          exp['id'] = exp['id'] ? exp['id'] : exp['_id'];
          expList.push( exp );
        }
        return expList;
      })
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }

  getExperiment(id: string): Observable<Experiment> {
    const url = `${this.apiURL}experiments/${id}`;
    return this.http.get(url)
      .map((res: Response) => {
        const exp = res.json().info;
        exp['id'] = exp['id'] ? exp['id'] : exp['_id'];
        return exp as Experiment;
      } )
      //.do(data => console.log('server data:', data))  // debug
      .catch(this.handleError);
  }

  getExperimentMetrics(id: string): Observable<any[]> {
    const url = `${this.apiURL}experiments/${id}/metrics`;
    return this.http.get(url)
        .map((res: Response) => res.json() as any[] )
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
