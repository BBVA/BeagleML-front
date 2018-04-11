import { Component, Input, OnChanges } from '@angular/core';
import { Experiment } from '../../models/experiment';

@Component({
  moduleId: module.id,
  selector: 'pool-table',
  templateUrl: 'pool-table.component.html',
  styleUrls: ['pool-table.component.css']
})
export class PoolTableComponent implements OnChanges {

  @Input() experiments: Experiment[] = [];

  rows: any[] = []; //visible experiments
  allExperiments: Experiment[]; //all experiments
  allColumns: any[] = ['name', 'project_name'];
  allStates: any[] = [  //all states
    {name:'queue',label:'Queue'},
    {name:'pool',label:'Running'},
    {name:'completed',label:'Completed'},
    {name:'timeout',label:'Time Out'},
    {name:'stopped',label:'Stopped'},
    {name:'accuracy_limit_reached',label:'Accuracy Target'}
  ];
  states: any[] = this.allStates; //visible states

  constructor() {}

  ngOnChanges() {
    this.allExperiments = this.experiments;
    this.showExperiments();
  }

  showExperiments() {
    this.rows = this.prepareExperimentsForTable();
  }

  /**
   * Receive all experiments as comes in the service and prepare them
   * to be used in the table.
   *
   * Every experiment for the table must be a plain object with props, so we create an object
   * with id, name and every experiment.parameter as a prop in the new object
   *
   * @param experiments
   */
  prepareExperimentsForTable() {
    const allPrepared :any[] = [];

    for (let experiment of this.experiments) {

      const prepared: any = {
        name: experiment.name,
        projectName: experiment.project_name
      };

      allPrepared.push(prepared);
    }

    return allPrepared;
  }


  /**
   * Extract all cols from an experiment parameters
   *
   * @param experiment
   */
  getCols() {
    const cols = [
      'name', 'project_name'
    ];
    return cols;
  }

  /**
   * Event to habdle row click and show the experiment metric.
   *
   * @param event
   */
  onSelect( event: any) {
  }

}
