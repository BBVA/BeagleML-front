import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';
import { Experiment } from '../models/experiment';

import { switchMap } from 'rxjs/operators';

/**
 * This class represents the lazy loaded ProjectComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css'],
})
export class ProjectComponent implements OnInit {

  project: Project;
  experiments: Experiment[] = [];    //visible experiments

  /**
   * @param {ProjectsService} projectsService - The injected ProjectsService.
   */
  constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

  /**
   * Get the project OnInit
   */
  ngOnInit() {
    this.route.params
      .pipe(switchMap((params: Params) => this.projectService.getProject(params['id'])))
      .subscribe((project: Project) => {
        this.project = project;
        this.loadExperiments();
      });
  }

  loadExperiments() {
    this.projectService.getExperimentsByProjectId(this.project.id)
      .subscribe((experiments: any) => {
        if( experiments.length > 0 ) {
          this.experiments = experiments;
        }
      });
  }

}
