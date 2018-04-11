import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import JSONFormatter from 'json-formatter-js/dist/json-formatter';

@Component({
    moduleId: module.id,
    selector: 'project-definition-detail',
    templateUrl: 'project-definition-detail.component.html',
    styleUrls: ['project-definition-detail.component.css'],
})
export class ProjectDefinitionDetailComponent {

  @ViewChild(BaseChartDirective) chart:BaseChartDirective;

  config: any;

  constructor(private projectService: ProjectService) {
    this.config = {
      hoverPreviewEnabled: false,
      hoverPreviewArrayCount: 100,
      hoverPreviewFieldCount: 5,
      theme: '',
      animateOpen: true,
      animateClose: true,
      useToJSON: true
    };
  }

  init(elem: any, data: any): any {
    let rows:any = [];
    let div = document.getElementById('project-detail');

    div.innerHTML = '';

    const formatter = new JSONFormatter(
      data[elem[0].$$index], 'Infinity', this.config
    );

    let dom = formatter.render();
    div.appendChild(dom);
  }
}
