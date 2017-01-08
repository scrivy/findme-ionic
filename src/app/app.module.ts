import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { MyApp } from './app.component'
import { MapPage } from '../pages/map/map'
import { WsService } from '../services/ws/ws'
import { LocationService } from '../services/locations/locations'
import { LocationTracker } from '../services/tracker/tracker'
import { HttpModule } from '@angular/http'

@NgModule({
  declarations: [
    MyApp,
    MapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WsService,
    LocationService,
    LocationTracker
  ]
})
export class AppModule {}
