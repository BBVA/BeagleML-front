import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
      { path: 'project/:id', component: ProjectComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
