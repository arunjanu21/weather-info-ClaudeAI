// MUST import zone.js first - Angular requires it
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import './styles.css';

bootstrapApplication(AppComponent, {
  providers: [],
}).catch((err) => console.error(err));
