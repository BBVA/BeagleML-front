import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { NgUploaderOptions, UploadRejected } from 'ngx-uploader';
import { Config } from '../../shared/config/env.config';
import { ModelService } from '../../services/model.service';
import { ProjectService } from '../../services/project.service';
import { DialogErrorComponent } from '../../shared/dialog-error.component';

/**
 * This class represents the lazy loaded ProjectAddComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-project-add',
  templateUrl: 'project-add.component.html',
  styleUrls: ['project-add.component.css']
})
export class ProjectAddComponent implements OnInit {

  modelOptions: NgUploaderOptions;
  projectOptions: NgUploaderOptions;
  loading:boolean = false;
  numberOfTicks = 0;
  errorMessage:string = '';


  /**
   * @param {ProjectConfigService} projectConfigService - The injected ProjectConfigService.
   */
  constructor(public dialog: MdDialog, public modelService: ModelService, public projectService: ProjectService, private ref: ChangeDetectorRef) {
    this.projectOptions = new NgUploaderOptions({
      url: `${Config.DOMAIN}${Config.API}upload`,
      filterExtensions: true,
      allowedExtensions: ['yml', 'yaml', 'json'],
      data: { type: 'project' },
      customHeaders: { type: 'project' },
      fieldName: 'file',
      fieldReset: true,
      method: 'POST',
    });
    this.modelOptions = new NgUploaderOptions({
      url: `${Config.DOMAIN}${Config.API}upload`,
      filterExtensions: true,
      allowedExtensions: ['yml', 'yaml', 'json'],
      data: { type: 'model' },
      customHeaders: { type: 'model' },
      fieldName: 'file',
      fieldReset: true,
      method: 'POST',
    });

    setInterval(() => {
      this.numberOfTicks ++;
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 1000);
  }

  ngOnInit() {

  }

  addModel(template: any) {
    const messageOK = 'Model uploaded successfully';
    const messageKO = 'Error while trying to upload model file';
    this.modelService.add(template)
      .subscribe(
        response => {
          this.dialog.open(DialogErrorComponent, {data: {description: messageOK}});
        },
        error => this.errorMessage = <any>error
      );
  }

  addProject(project: any) {
    const messageOK = 'Project definition uploaded successfully';
    const messageKO = 'Error while trying to upload project definition file';
    this.projectService.add(project)
      .subscribe(
        response => {
          this.dialog.open(DialogErrorComponent, {data: {description: messageOK}});
        },
        error => this.errorMessage = <any>error
      );
  }

  onBrowseClick(event: any) {
    document.getElementById('browse-btn').click();
  }
  onBrowseModelsClick(event: any) {
    document.getElementById('browse-models-btn').click();
  }

  handleBack(event: any) {
    history.back();
  }

  handleUploadRejected(error: any): void {
    if( error.reason === UploadRejected.EXTENSION_NOT_ALLOWED ) {
      const description = 'Only .yml, .yaml or .json extensions are allowed';
      this.dialog.open(DialogErrorComponent, { data: { description: description } });
    }
  }

  handleUpload(event: any) {
    const self = this;
    let description;
    this.loading = true;

    event.xhr.onerror = (data: any) => {
      console.log('onerror', data);
    };

    event.xhr.onload = (data: any) => {
      console.log('onload', data);
      const body = JSON.parse(event.xhr.response);
      self.loading = false;

      if (body && body.model_id) {
        this.addProject(body);
      } else if (body) {
        this.addModel(body.template)
      }
    };
  }
}
