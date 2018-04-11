import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  DOMAIN: 'http://localhost:5000/',
  API: 'api/v1/'
};

export = DevConfig;

