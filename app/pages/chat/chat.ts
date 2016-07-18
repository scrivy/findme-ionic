import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MapPage} from '../map/map'
import {SettingsPage} from '../settings/settings'

@Component({
  templateUrl: 'build/pages/chat/chat.html'
})
export class ChatPage {
  public mapPage: any = MapPage
  public settingsPage: any = SettingsPage

  constructor(private navController: NavController) {}
}
