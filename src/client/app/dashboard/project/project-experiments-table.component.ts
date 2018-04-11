import { Component, Input, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Experiment } from '../../models/experiment';
import { ExperimentMetricComponent } from './experiment-metric.component';

import * as _ from 'lodash';

class Column {
  name: string;
}

class State {
  name: string;
}

@Component({
  moduleId: module.id,
  selector: 'project-experiments-table',
  templateUrl: 'project-experiments-table.component.html',
  styleUrls: ['project-experiments-table.component.css']
})
export class ProjectExperimentsTableComponent implements OnChanges {

  @Input() experiments: Experiment[] = [];

  rows: any[] = []; //visible experiments
  allExperiments: Experiment[]; //all experiments
  columns: Column[];    //visible columns
  allColumns: Column[]; //all columns
  allStates: any[] = [  //all states
    {name:'queue',label:'Queue'},
    {name:'pool',label:'Running'},
    {name:'completed',label:'Completed'},
    {name:'timeout',label:'Time Out'},
    {name:'stopped',label:'Stopped'},
    {name:'accuracy_limit_reached',label:'Accuracy Target'}
  ];
  states: any[] = this.allStates; //visible states

  constructor(private dialog: MdDialog) {}

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
    console.log( 'experiments ', this.experiments );

    if (!this.allColumns || this.allColumns.length === 0) {
      const cols = this.getCols(this.experiments[0]);
      this.allColumns = cols;
      this.columns = cols.slice(0, cols.length > 5 ? 5 : cols.length);
    }

    const allPrepared :any[] = [];

    for (let experiment of this.experiments) {

      const prepared: any = {
        id: experiment.id,
        name: experiment.name,
        state: experiment.state
      };
      for( let param of experiment.parameters ){
        prepared[param.name] = param.value;
      }
      allPrepared.push(prepared);
    }
    return allPrepared;
  }

  /**
   * Toggle a column
   *
   * @param col
   */
  toggle(col: Column) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }

  /**
   * Check if a given column is checked/visible
   *
   * @param col
   * @return {any}
   */
  isChecked(col: Column) {
    return this.columns.find(c => {
      return c.name === col.name;
    });
  }


  /**
   * Check if the state is checked in the state filter
   *
   * @param state
   * @return {any}
   */
  isCheckedState( state: State) {
    var obj = this.states.find(c => {
      return c.name === state.name;
    });
    return obj?true:false;
  }

  /**
   * Checks or un-checks a state from the state filter and perform a filter in the rows
   *
   * @param state
   */
  toggleState(state: State) {
    const isChecked = this.isCheckedState(state);

    if(isChecked) {
      this.states = this.states.filter(c => {
        return c.name !== state.name;
      });
    } else {
      this.states = [...this.states, state];
    }
    this.filterRowsWithStates();
  }

  /**
   * Filter all row agains the checked states in the state filter
   *
   */
  filterRowsWithStates() {
    const filteredExperiments = _.filter(this.allExperiments, (experiment: Experiment) => {
      let s: State = {'name': experiment.state};
      return this.isCheckedState(s);
    });
    this.experiments = filteredExperiments;
    this.showExperiments();
  }

  /**
   * Extract all cols from an experiment parameters
   *
   * @param experiment
   */
  getCols(experiment: Experiment) {
    const cols = [];
    if(experiment) {
      for( let param of experiment.parameters ){
        cols.push({name:param.name,prop:param.name});
      }
    }
    return cols;
  }

  /**
   * Determine a cell class for each possible state
   *
   * Possible states:
   *  - queue
   *  - pool
   *  - completed
   *  - stopped
   *  - timeout
   *  - accuracy_limit_reached
   *
   * @param info
   * @return {
   * is-queue: boolean,
   * is-pool: boolean,
   * is-completed: boolean,
   * is-stopped: boolean,
   * is-timeout: boolean,
   * is-accuracy_limit_reached: boolean
   * }
   */
  getCellClass(info: any) {
    return {
      'is-queue': info.row.state === 'queue',
      'is-pool': info.row.state === 'pool',
      'is-completed': info.row.state === 'completed',
      'is-stopped': info.row.state === 'stopped',
      'is-timeout': info.row.state === 'timeout',
      'is-accuracy_limit_reached': info.row.state === 'accuracy_limit_reached'
    };
  }

  /**
   * Event to habdle row click and show the experiment metric.
   *
   * @param event
   */
  onSelect( event: any) {
    const dialogRef = this.dialog.open(ExperimentMetricComponent, {width:'800px', height:'600px'});
    dialogRef.componentInstance['loadMetric'](event.selected[0].id);
  }

}
