import { FormsModule } from '@angular/forms';
import { MdSnackBarModule, MdSnackBar } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NgFileSelectDirective, UploadRejected } from 'ngx-uploader';
import {
  async,
  TestBed
 } from '@angular/core/testing';

import { ProjectAddComponent } from './project-add.component';
import { MaterialModule } from '../../shared/material.module';

export function main() {
  describe('ProjectAdd component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule, MaterialModule, RouterTestingModule, MdSnackBarModule],
        declarations: [ProjectAddComponent, NgFileSelectDirective],
        providers: [
          { provide: MdSnackBar, useValue: new MockSnackBar() }
        ]
      });

    });

    it('should have a p',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ProjectAddComponent);
            let projectAddDOMEl = fixture.debugElement.nativeElement;
            expect(projectAddDOMEl.querySelectorAll('p').length).toEqual(1);
          });

      }));

    it('should snackbar for errors in handleUpload',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ProjectAddComponent);
            let mockSnackBar = fixture.debugElement.injector.get<any>(MdSnackBar) as MockSnackBar;
            let mockSnackBarSpy = spyOn(mockSnackBar, 'open').and.callThrough();

            const component = fixture.componentInstance;
            const data = {error:true};
            component.handleUpload(data);

            expect(mockSnackBarSpy).toHaveBeenCalledWith(
              'There was an error uploading the file',
              '',
              {duration:2000});
          });

      }));

    it('should snackbar for errors in handleUploadRejected',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(ProjectAddComponent);
            let mockSnackBar = fixture.debugElement.injector.get<any>(MdSnackBar) as MockSnackBar;
            let mockSnackBarSpy = spyOn(mockSnackBar, 'open').and.callThrough();

            const component = fixture.componentInstance;
            const data = {reason:UploadRejected.EXTENSION_NOT_ALLOWED};
            component.handleUploadRejected(data);

            expect(mockSnackBarSpy).toHaveBeenCalledWith(
              'Only .yml or .yaml extensions are allowed',
              '',
              {duration:2000});
          });

      }));
  });
}

class MockSnackBar {
  open() {
    //mocked
  }
}
