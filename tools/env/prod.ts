import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  DOMAIN: '##API##',
  API: 'api/v1/'
};

export = ProdConfig;

