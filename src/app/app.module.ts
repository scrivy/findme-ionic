import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { MyApp } from './app.component'
import { MapPage } from '../pages/map/map'
import { WsService } from '../services/ws/ws'
import { LocationService } from '../services/locations/locations'
import { LocationTracker } from '../services/tracker/tracker'
import { HttpModule } from '@angular/http'
// import { AboutPage } from '../pages/about/about';
// import { ContactPage } from '../pages/contact/contact';
// import { HomePage } from '../pages/home/home';
// import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    MapPage
//    AboutPage,
//    ContactPage,
//    HomePage,
//    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
//    AboutPage,
//    ContactPage,
//    HomePage,
//    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WsService,
    LocationService,
    LocationTracker
  ]
})
export class AppModule {}
