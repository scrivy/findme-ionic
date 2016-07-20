import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {MapPage} from './pages/map/map';
import {WsService} from './services/ws/ws';
import {LocationsService} from './services/locations/locations'

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    WsService,
    LocationsService
  ]
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = MapPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);
