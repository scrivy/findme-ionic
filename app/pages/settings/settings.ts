import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MapPage} from '../map/map'
import {ChatPage} from '../chat/chat'

@Component({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
  public mapPage: any = MapPage
  public chatPage: any = ChatPage

  constructor(private navController: NavController) {}
}
