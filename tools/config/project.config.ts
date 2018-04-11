import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  FONTS_DEST = `${this.APP_DEST}/css/fonts`;
  FONTS_SRC = [
    'node_modules/@swimlane/ngx-datatable/release/assets/fonts/**'
  ];

  constructor() {
    super();

    this.ENABLE_SCSS = true;

    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'chart.js/dist/Chart.js', inject: true},
      // {src: '@angular/material/prebuilt-themes/indigo-pink.css', inject: true},
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    let additionalPackages: ExtendPackages[] = [{
      name:'@angular/material',
      path:'node_modules/@angular/material/bundles/material.umd.js',
      packageMeta:{
        main: 'index.js',
        defaultExtension: 'js'
      }
    },{
      name:'chartjs',
      path:'node_modules/chartjs/dist/Chart.bundle.js'
    },
    {
      name: '@angular/cdk',
      path: 'node_modules/@angular/cdk/bundles/cdk.umd.js'
    },
    {
      name: '@angular/cdk/a11y',
      path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
    },
    {
      name: '@angular/cdk/bidi',
      path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
    },
    {
      name: '@angular/cdk/coercion',
      path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
    },
    {
      name: '@angular/cdk/collections',
      path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
    },
    {
      name: '@angular/cdk/keycodes',
      path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
    },
    {
      name: '@angular/cdk/observers',
      path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
    },
    {
      name: '@angular/cdk/overlay',
      path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
    },
    {
      name: '@angular/cdk/platform',
      path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
    },
    {
      name: '@angular/cdk/portal',
      path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
    },
    {
      name: '@angular/cdk/rxjs',
      path: 'node_modules/@angular/cdk/bundles/cdk-rxjs.umd.js'
    },
    {
      name: '@angular/cdk/scrolling',
      path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
    },
    {
      name: '@angular/cdk/stepper',
      path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
    },
    {
      name: '@angular/cdk/table',
      path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
    },
    {
      name:'@swimlane/ngx-datatable',
      path:'node_modules/@swimlane/ngx-datatable/release/index.js'
    },{
      name:'ngx-uploader',
      path:'node_modules/ngx-uploader/bundle/ngx-uploader.umd.js'
    },{
      name:'ngx-stepper',
      path:'node_modules/ngx-stepper/bundles/ngx-stepper.umd.js'
    },{
      name: 'lodash',
      path: 'node_modules/lodash/lodash.js'
    },{
      name: 'ng2-charts',
      path: 'node_modules/bundles/ng2-charts.umd.js'
    }];
    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
