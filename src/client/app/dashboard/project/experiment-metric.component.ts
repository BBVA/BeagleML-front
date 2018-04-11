import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
    moduleId: module.id,
    selector: 'sd-experiment-metric',
    templateUrl: 'experiment-metric.component.html',
    styleUrls: ['experiment-metric.component.css'],
})
export class ExperimentMetricComponent {

  @ViewChild(BaseChartDirective) chart:BaseChartDirective;

  lineChartLegend:boolean = true;
  lineChartType:string = 'line';
  lineChartData:Array<any> = [{
      data:[],
      label: 'Accuracy',
      yAxisID: 'accuracy-axys'
    },{
      data:[],
      label:'Cost',
      yAxisID:'cost-axys'
    }];
  lineChartLabels:Array<any> = [];
  lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          position: 'left',
          id: 'cost-axys'
        }, {
          position: 'right',
          id: 'accuracy-axys',
          ticks: {
            max: 1,
            min: 0,
            stepSize: 0.1
          }
        }
      ]
    }
  };

  lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  constructor(private projectService: ProjectService) {}

  chartClicked(e:any) {
    console.log(e);
  }

  chartHovered(e:any) {
    console.log(e);
  }

  loadMetric( id: string ) {
    this.projectService.getExperimentMetrics( id )
      .subscribe((res: any[]) => {

        const accuracy = [];
        const cost = [];
        const _lineChartLabels = [];
        const _lineChartData = {...this.lineChartData};

        for( let point of res ) {
          accuracy.push(point.accuracy);
          cost.push(point.cost);
          _lineChartLabels.push( Math.floor(point.experimentTime) );
        }

        _lineChartData[0].data = accuracy;
        _lineChartData[1].data = cost;

        this.lineChartData = _lineChartData;
        this.chart.chart.config.data.labels = _lineChartLabels;
      });
  }

}
