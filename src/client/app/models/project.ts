export class Project {
  id: string;
  name?: string;
  queue?: number;
  completed?: number;
  pool?: number;
  timeout?: number;
  failed?: number;
  accuracy_limit_reached?: number;
  stopped?: number;
  parameters?: any[];
  experiments?: any[];
  total?: number;
}
