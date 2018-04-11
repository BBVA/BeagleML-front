import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  async,
  TestBed
 } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../shared/material.module';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';


export function main() {
  describe('Dashboard component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule, NgxDatatableModule, MaterialModule, RouterTestingModule],
        declarations: [DashboardComponent],
        providers: [
          { provide: ProjectService, useValue: new MockProjectsService() }
        ]
      });

    });

    it('should call ProjectService getProjects on oinit',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            let dashboardInstance = fixture.debugElement.componentInstance;
            let mockProjectsService = fixture.debugElement.injector.get<any>(ProjectService) as MockProjectsService;
            let projectsServiceSpy = spyOn(mockProjectsService, 'getProjects').and.callThrough();

            fixture.detectChanges();

            expect(dashboardInstance.projectsService).toEqual(jasmine.any(MockProjectsService));
            expect(projectsServiceSpy.calls.count()).toBe(1);

          });

      }));

    it('should have a datatable',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            let dashboardDOMEl = fixture.debugElement.nativeElement;
            expect(dashboardDOMEl.querySelectorAll('ngx-datatable').length).toEqual(1);
          });

      }));

    it('should display a datatable row for each project',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            let dashboardDOMEl = fixture.debugElement.nativeElement;
            let mockProjectsService = fixture.debugElement.injector.get<any>(ProjectService) as MockProjectsService;

            mockProjectsService.returnValue = [
              {name:'prj',id:'1a'},
              {name:'prj2',id:'2a'}
            ];

            fixture.detectChanges();

            expect(dashboardDOMEl.querySelectorAll('datatable-row-wrapper').length).toEqual(2);

          });

      }));

    it('should have a toolbar',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            let dashboardDOMEl = fixture.debugElement.nativeElement;
            expect(dashboardDOMEl.querySelectorAll('md-toolbar').length).toEqual(1);
          });

      }));

    it('should have a link to add a new project',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            let dashboardDOMEl = fixture.debugElement.nativeElement;
            expect(dashboardDOMEl.querySelectorAll('a[routerLink="/project/add"]').length).toEqual(1);
          });

      }));

    it('should filter project with updateFilter for filter not_started',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            const component = fixture.componentInstance;
            const projects = [
              {name:'prj_done',id:'1a',ended:1,queue:0,pool:0},
              {name:'prj_not_started',id:'1b',ended:0,queue:2,pool:0},
              {name:'prj_started',id:'1c',ended:1,queue:1,pool:1}
            ];

            component.projectsCached = projects;
            component.updateFilter('not_started');

            expect(component.projects.length).toEqual(1);
            expect(component.projects[0]).toEqual(projects[1]);
          });

      }));

    it('should filter project with updateFilter for filter done',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            const component = fixture.componentInstance;
            const projects = [
              {name:'prj_done',id:'1a',ended:1,queue:0,pool:0},
              {name:'prj_not_started',id:'1b',ended:0,queue:2,pool:0},
              {name:'prj_started',id:'1c',ended:1,queue:1,pool:1}
            ];

            component.projectsCached = projects;
            component.updateFilter('done');

            expect(component.projects.length).toEqual(1);
            expect(component.projects[0]).toEqual(projects[0]);
          });

      }));

    it('should filter project with updateFilter for filter all',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(DashboardComponent);
            const component = fixture.componentInstance;
            const projects = [
              {name:'prj_done',id:'1a',ended:1,queue:0,pool:0},
              {name:'prj_not_started',id:'1b',ended:0,queue:2,pool:0},
              {name:'prj_started',id:'1c',ended:1,queue:1,pool:1}
            ];

            component.projectsCached = projects;
            component.updateFilter('all');

            expect(component.projects.length).toEqual(3);
          });

      }));
  });

}

class MockProjectsService {

  returnValue: Project[];

  getProjects(): Observable<Project[]> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
