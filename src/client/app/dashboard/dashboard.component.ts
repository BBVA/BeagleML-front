import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NgClass } from '@angular/common';
import { PoolService } from '../services/pool.service';
import { QueueService } from '../services/queue.service';
import { ModelService } from '../services/model.service';
import { ProjectService } from '../services/project.service';
import { SystemService } from '../services/system.service';
import { Experiment } from '../models/experiment';
import { Project } from '../models/project';
import { Model } from '../models/model';
import { DialogErrorComponent } from '../shared/dialog-error.component';
import { DialogConfirmComponent } from '../shared/dialog-confirm.component';


import set = Reflect.set;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  @ViewChild('project_table') table: any;

  errorMessage: string;
  experimentsLimit: Number;
  filterSelected: string = '';
  queue: Experiment[] = [];
  pool: Experiment[] = [];
  loading: boolean = false;
  models: Model[] = [];
  panelOpenState:any = [false, false, true, true];
  projects: Project[] = [];
  projectsCached: Project[] = [];
  system: any = {
    id: '0',
    running: false,
  };

  toggleRunning: false;

  /**
   * @param {ProjectService} projectService - The injected ProjectService.
   */
  constructor(public modelService: ModelService,
              public queueService: QueueService,
              public poolService: PoolService,
              public projectService: ProjectService,
              public systemService: SystemService,
              public dialog: MdDialog) {}

  /**
   * Get the project OnInit
   */
  ngOnInit() {
    this.getSystem();
  };

  deleteProject(id: string) {
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '250px',
      data: {
        title: ' Ready to remove project. \n' +
        'Sure?',
        description: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.removeExperimentsFromProject(id)
          .subscribe(
            () => {
              this.dialog.open(DialogErrorComponent, {data: {description: 'Project has been removed successfully'}});
            },
            error => {
              this.errorMessage = <any>error;
            }
          );
      }
    });
  }

  /**
   * Handle the highlightsService observable
   */
  getPool() {
    this.loading = true;
    this.poolService.get()
      .subscribe(
        response => {
          this.pool = response;
          this.loading = false;
        },
        error => this.errorMessage = <any>error
      );
  }

  /**
   * Handle the highlightsService observable
   */
  getQueue() {
    this.loading = true;
    this.queueService.get()
      .subscribe(
        response => {
          this.queue = response;
          this.loading = false;
        },
        error => this.errorMessage = <any>error
      );
  }

  /**
   * Handle the modelsService observable
   */
  getModels() {
    this.loading = true;
    this.modelService.get()
      .subscribe(
        response => {
          this.models = response;
          this.loading = false;
        },
        error => this.errorMessage = <any>error
      );
  }

  /**
   * Handle the projectsService observable
   */
  getProjects() {
    this.loading = true;
    this.projectService.getProjects()
      .subscribe(
        projects => {
          this.projects = projects;
          this.projectsCached = projects;
          this.loading = false;
          this.filterProjects();
        },
        error => this.errorMessage = <any>error
      );
  }

  refreshWorld(self: any) {
    if (this.panelOpenState[0]) self.getModels();
    if (this.panelOpenState[2]) self.getPool();
    if (this.panelOpenState[3]) self.getQueue();

    self.getProjects();
    self.getSystem();
  }


  /**
   * Handle the projectsService observable
   */
  getSystem() {
    const self: any = this;
    this.loading = true;
    this.systemService.getSystems()
      .subscribe(
        response => {
          setTimeout(function () {
            self.refreshWorld(self);
          }, 3000)
          self.system = response[0];
          self.toggleRunning = self.system.running;
          self.loading = false;
          self.experimentsLimit = self.system.experimentsLimit;
        },
        error => this.errorMessage = <any>error
      );
  }

  systemPlay() {
    this.systemService.play(this.system.id)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
    this.system.running = true;
  }

  systemReset() {

    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '250px',
      data: {
        title: ' Ready to reset the system.\n' +
        'Sure?',
        description: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.systemService.reset(this.system.id)
          .subscribe(
            response => {
              let self = this;
              this.getProjects();
              setTimeout(() => self.getProjects(), 2000);
            },
            error => {
              this.errorMessage = <any>error;
            }
          );
      }
    });

  }

  systemStop() {
    this.systemService.stop(this.system.id)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
    this.system.running = false;
  }

  systemUpdate() {
    console.log('systemUpdate');
    const body = {
      running: this.toggleRunning,
      experimentsLimit: this.experimentsLimit
    };

    this.systemService.update(this.system.id, body)
      .subscribe(
        response => {
          console.log(response);
        },
        error => this.errorMessage = <any>error
      );
  }

  togglePanel(index: number, opened: boolean) {
    this.panelOpenState[index] = opened;

    if (!this.panelOpenState[0] && !this.panelOpenState[1]) {
      document.getElementById('row-0').style.height = '100px';
    } else {
      document.getElementById('row-0').style.height = '400px';
    }

    if (!this.panelOpenState[2] && !this.panelOpenState[3]) {
      document.getElementById('row-1').style.height = '100px';
    } else {
      document.getElementById('row-1').style.height = '400px';
    }
  }

  changeFilter(filter: string) {
    this.filterSelected = filter;
    this.filterProjects();
  }

  filterProjects() {
    const self = this;
    const temp = this.projectsCached.filter(function(project) {
      switch(self.filterSelected) {
        case 'done':
          return project.queue === 0 && project.pool === 0;
        case 'not_started':
          return project.completed === 0 && project.pool === 0;
        case 'all':
          return true;
        default:
          return true;
      }
    });

    // update the rows
    this.projects = temp;
    this.table.offset = 0;
  }

}
