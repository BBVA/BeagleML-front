import { NgModule } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgUploaderModule } from 'ngx-uploader';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PoolTableComponent } from './pool/pool-table.component';
import { QueueTableComponent } from './queue/queue-table.component';
import { ProjectComponent } from './project.component';
import { ProjectAddComponent } from './project/project-add.component';
import { ProjectDefinitionDetailComponent } from './project/project-definition-detail.component';
import { DialogErrorComponent } from '../shared/dialog-error.component';
import { DialogConfirmComponent } from '../shared/dialog-confirm.component';
import { ProjectInfoComponent } from './project/project-info.component';
import { ProjectExperimentsTableComponent } from './project/project-experiments-table.component';
import { ProjectModelsTableComponent } from './project/project-models-table.component';
import { ExperimentMetricComponent } from './project/experiment-metric.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectService } from '../services/project.service';
import { QueueService } from '../services/queue.service';
import { PoolService } from '../services/pool.service';
import { ModelService } from '../services/model.service';
import { SystemService } from '../services/system.service';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    NgxDatatableModule,
    NgUploaderModule,
    ChartsModule
  ],
  declarations: [
    DashboardComponent,
    ProjectComponent,
    ProjectAddComponent,
    ProjectDefinitionDetailComponent,
    DialogErrorComponent,
    DialogConfirmComponent,
    ExperimentMetricComponent,
    QueueTableComponent,
    PoolTableComponent,
    ProjectInfoComponent,
    ProjectExperimentsTableComponent,
    ProjectModelsTableComponent
  ],
  exports: [DashboardComponent],
  providers: [
    ProjectService,
    PoolService,
    QueueService,
    ModelService,
    SystemService,
    {provide: MD_DIALOG_DATA, useValue: {} },
    {provide: MdDialogRef, useValue: {} }
  ],
  entryComponents: [
    DialogErrorComponent,
    DialogConfirmComponent,
    ExperimentMetricComponent,
    ProjectDefinitionDetailComponent
  ],
})
export class DashboardModule { }
