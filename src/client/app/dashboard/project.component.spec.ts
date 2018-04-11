import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  async,
  TestBed, ComponentFixture
} from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProjectComponent } from './project.component';
import { MaterialModule } from '../shared/material.module';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';
import { Experiment } from '../models/experiment';

class PreparedComponent {
  fixture: ComponentFixture<ProjectComponent>;
  mockService: MockProjectsService;
}

/**
 * Prepare a ProjectComponent with mocked service and custom Project and Experiments
 * as mocked responses.
 *
 * Service methods mocked
 * - getProject
 * - getExperiment (also spy)
 *
 * @param project     project to return on getPorject()
 * @param experiment  experiment to return on getExperiment()
 * @return {{fixture: ComponentFixture<ProjectComponent>, mockProjectsService: MockProjectsService}}
 */
function prepareComponent(project: Project, experiments: Experiment[]): PreparedComponent {
  let fixture = TestBed.createComponent(ProjectComponent);
  let mockProjectsService = fixture.debugElement.injector.get<any>(ProjectService) as MockProjectsService;

  mockProjectsService.getProjectValue = project || {id:'1p'};

  if( experiments && experiments.length > 0 ) {
    let times: number = 0;
    spyOn(mockProjectsService, 'getExperiment').and.callFake(function(){
      times ++;
      const exp = experiments[times-1];
      return Observable.create((observer: any) => {
        observer.next(exp);
        observer.complete();
      });
    });
  } else {
    mockProjectsService.getExperimentValue = {id:'1e'};
  }

  return {fixture, mockService: mockProjectsService};
}

export function main() {
  describe('Project component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, MaterialModule, RouterTestingModule, NgxDatatableModule],
        declarations: [ProjectComponent],
        providers: [
          { provide: ProjectService, useValue: new MockProjectsService() }
        ]
      });
    });

    it('should call ProjectService getProject on oinit',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {

            const project = {id:'1a',name:'prj1'};

            const preparedComp = prepareComponent(project, null);
            let projectInstance = preparedComp.fixture.debugElement.componentInstance;
            let projectsServiceSpy = spyOn(preparedComp.mockService, 'getProject').and.callThrough();

            preparedComp.fixture.detectChanges();

            expect(projectInstance.projectsService).toEqual(jasmine.any(MockProjectsService));
            expect(projectsServiceSpy.calls.count()).toBe(1);

          });

      }));

    it('should loadExperiments load every experiment in a project',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const exp1 = {id:'1a',parameters:[{name:'p1',value:'v1'}]};
            const exp2 = {id:'1a',parameters:[{name:'p1',value:'v1'}]};
            const experiments = [exp1, exp2];

            const preparedComp = prepareComponent(null, experiments);
            const component = preparedComp.fixture.componentInstance;

            component.project = {id:'1a'};
            component.project.experiments = experiments;
            component.loadExperiments();
            // ignore typescript error TS2339 by casting as any before using 'calls'
            // https://github.com/Microsoft/TypeScript/issues/6436
            expect((preparedComp.mockService.getExperiment as any).calls.count()).toBe(experiments.length);
          });

      }));

    it('onSelectRow can handle rows checks and unchecks',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const exp1 = {id:'1a'};
            const exp2 = {id:'1b'};
            const exp3 = {id:'1c'};
            const exp4 = {id:'1d'};
            const experiments = [exp1, exp2, exp3, exp4];

            const preparedComp = prepareComponent(null, experiments);
            const component = preparedComp.fixture.componentInstance;

            component.project = {id:'1a'};
            component.project.experiments = experiments;

            component.onSelectRow({checked:true}, exp1);
            expect(component.selectedRows.length).toBe(1);

            //add row repeated
            component.onSelectRow({checked:true}, exp1);
            expect(component.selectedRows.length).toBe(1);

            //add a second row
            component.onSelectRow({checked:true}, exp2);
            expect(component.selectedRows.length).toBe(2);

            //add a thrid row
            component.onSelectRow({checked:true}, exp3);
            expect(component.selectedRows.length).toBe(3);

            //remove a row
            component.onSelectRow({checked:false}, exp3);
            expect(component.selectedRows.length).toBe(2);

            //remove it again
            component.onSelectRow({checked:false}, exp3);
            expect(component.selectedRows.length).toBe(2);

          });

      }));

    it('should show a row for each experiment',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const exp1 = {id:'1a',parameters:[{name:'p1',value:'v1'}]};
            const exp2 = {id:'1a',parameters:[{name:'p1',value:'v1'}]};
            const experiments = [exp1, exp2];
            const project = {id:'1a',name:'prj1', experiments};

            const preparedComp = prepareComponent(project, experiments);
            let dom = preparedComp.fixture.debugElement.nativeElement;

            preparedComp.fixture.detectChanges();

            expect(dom.querySelectorAll('datatable-body-row').length).toEqual(experiments.length);
          });

      }));

    it('should show total and ended experiments on a md-card',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {

            const exp1 = {id:'1a',parameters:[{name:'p1',value:'v1'}], state:'ended'};
            const exp2 = {id:'1b',parameters:[{name:'p1',value:'v1'}], state:'ended'};
            const exp3 = {id:'1c',parameters:[{name:'p1',value:'v1'}], state:'pool'};
            const exp4 = {id:'1d',parameters:[{name:'p1',value:'v1'}], state:'pool'};
            const experiments = [exp1, exp2, exp3, exp4];
            const project = {id:'1a',name:'prj1', experiments};

            const preparedComp = prepareComponent(project, experiments);

            let dom = preparedComp.fixture.debugElement.nativeElement;

            preparedComp.fixture.detectChanges();

            expect(dom.querySelectorAll('md-card').length).toEqual(1);

            const card = dom.querySelectorAll('md-card')[0];
            expect(card.textContent).toContain(`Total experiments 4`);
            expect(card.textContent).toContain(`2 finished.`);
          });

      }));

    it('should have a progress bar for experiments progress',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {

            const exp1 = {id:'1a',parameters:[{name:'p1',value:'v1'}], state:'ended'};
            const exp2 = {id:'1b',parameters:[{name:'p1',value:'v1'}], state:'ended'};
            const exp3 = {id:'1c',parameters:[{name:'p1',value:'v1'}], state:'pool'};
            const exp4 = {id:'1d',parameters:[{name:'p1',value:'v1'}], state:'pool'};
            const experiments = [exp1, exp2, exp3, exp4];
            const project = {id:'1a',name:'prj1', experiments};

            const preparedComp = prepareComponent(project, experiments);

            let dom = preparedComp.fixture.debugElement.nativeElement;

            preparedComp.fixture.detectChanges();

            expect(dom.querySelectorAll('md-progress-bar').length).toEqual(1);
          });

      }));

  });
}

class MockProjectsService {

  getExperimentValue: Experiment;
  getProjectValue: Project;

  getExperiment(): Observable<Experiment> {
    return Observable.create((observer: any) => {
      observer.next(this.getExperimentValue);
      observer.complete();
    });
  }

  getProject(): Observable<Project> {
    return Observable.create((observer: any) => {
      observer.next(this.getProjectValue);
      observer.complete();
    });
  }
}
