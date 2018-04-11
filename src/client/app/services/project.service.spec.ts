import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { ProjectService } from './project.service';

export function main() {
  describe('ProjectService Service', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ProjectService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          }
        ]
      });
    });

    describe('getProjects', () => {
      it('should return an Observable when get called', async(() => {
        expect(TestBed.get(ProjectService).getProjects()).toEqual(jasmine.any(Observable));
      }));

      it('should resolve to list of project when get called', async(() => {
        let projectService = TestBed.get(ProjectService);
        let mockBackend = TestBed.get(MockBackend);
        const projects = [{name:'project1',id:1}];
        const response = {info:{projects}};

        mockBackend.connections.subscribe((c: any) => {
          c.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(response) })));
        });

        projectService.getProjects().subscribe((data: any) => {
          expect(data).toEqual(projects);
        });
      }));

    });

    describe('getProject', () => {

      it('should return an Observable when get called', async(() => {
        expect(TestBed.get(ProjectService).getProject(1)).toEqual(jasmine.any(Observable));
      }));

      it('should resolve to project detail when get called', async(() => {
        let projectService = TestBed.get(ProjectService);
        let mockBackend = TestBed.get(MockBackend);

        const project = {name:'project1',id:1};
        const response = {info:project};

        mockBackend.connections.subscribe((c: any) => {
          c.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(response) })));
        });

        projectService.getProject(1).subscribe((data: any) => {
          expect(data).toEqual(project);
        });
      }));

    });

  });
}
