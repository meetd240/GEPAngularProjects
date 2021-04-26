// Workaround for Local Development, 
// This is only require for local development,
// If pushing to prod, please comment out
// Line 5 - import './polyfills';
//import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '../src/shell/app.module';
import { environment } from './environments/environment';

if (environment.production) { enableProdMode(); }
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));

