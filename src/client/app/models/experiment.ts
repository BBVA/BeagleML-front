export class ExperimentParam {
  name: string;
  value: any;
}

export class Experiment {
  id: string;
  create_time?: string;
  name?: string;
  project_name?: string;
  state?: string;
  parameters?: ExperimentParam[];
}
