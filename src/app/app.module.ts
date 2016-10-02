import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { WsService } from '../services/ws/ws';
import { LocationService } from '../services/locations/locations';
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
    IonicModule.forRoot(MyApp)
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
    WsService,
    LocationService
  ]
})
export class AppModule {}