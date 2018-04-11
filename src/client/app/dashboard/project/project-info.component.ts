import { Component, Input, OnChanges } from '@angular/core';
import { Experiment } from '../../models/experiment';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'project-info',
  templateUrl: 'project-info.component.html',
  styleUrls: ['project-info.component.css'],
})
export class ProjectInfoComponent implements OnChanges {

  @Input() experiments: Experiment[] = [];
  @Input() parameters: any[] = [];
  @Input() name: string = '';

  paramsVisible: boolean = false;
  totalExperiments: number = 0;
  finishedExperiments: number= 0;
  completedPercent: number = 0;

  ngOnChanges() {
    this.showInfo();
  }

  showInfo() {
    const finishedExperiments = _.filter(this.experiments, (experiment: Experiment) => {
      return experiment.state === 'ended';
    });

    this.totalExperiments = this.experiments.length;
    this.finishedExperiments = finishedExperiments.length;
    this.completedPercent = Math.floor((this.finishedExperiments * 100) / this.totalExperiments);
  }

}
