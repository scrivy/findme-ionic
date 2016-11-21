import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map'
import { LocationTracker } from '../services/tracker/tracker'

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
//  rootPage = TabsPage;
  rootPage = MapPage;

  constructor(platform: Platform, tracker: LocationTracker) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      tracker.startTracking();
    });
  }
}
