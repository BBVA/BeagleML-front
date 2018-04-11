import { Component, Input, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Model } from '../../models/model';
import * as moment from 'moment/moment';
import { ProjectDefinitionDetailComponent } from './project-definition-detail.component';

class Column {
  name: string;
}

class State {
  name: string;
}

@Component({
  moduleId: module.id,
  selector: 'project-models-table',
  templateUrl: 'project-models-table.component.html',
  styleUrls: ['project-models-table.component.css']
})
export class ProjectModelsTableComponent implements OnChanges {

  @Input() models: Model[] = [];

  rows: any[] = []; //visible models
  allModels: Model[]; //all models
  columns: any[] = ['create_time', 'filename'];
  allColumns: any[] = ['create_time', 'filename'];
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
    this.allModels = this.models;
    this.showModels();
  }

  showModels() {
    this.rows = this.prepareModelsForTable();
  }

  /**
   * Receive all models as comes in the service and prepare them
   * to be used in the table.
   *
   * Every model for the table must be a plain object with props, so we create an object
   * with id, name and every model.parameter as a prop in the new object
   *
   * @param models
   */
  prepareModelsForTable() {
    const allPrepared :any[] = [];

    for (let model of this.models) {
      const prepared: any = {
        filename: model.filename,
        date: moment(model.create_time).format('YYYY-M-DD HH:mm')
      };

      allPrepared.push(prepared);
    }
    return allPrepared;
  }


  /**
   * Extract all cols from an model parameters
   *
   * @param model
   */
  getCols() {
    const cols = [
      'name', 'create_time'
    ];
    return cols;
  }

  /**
   * Event to habdle row click and show the experiment metric.
   *
   * @param event
   */
  onSelect( event: any) {
    const dialogRef = this.dialog.open(ProjectDefinitionDetailComponent, {width:'800px', height:'600px'});
    dialogRef.componentInstance['init'](event.selected, this.models);
  }

}
