import {Component, AfterViewInit, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatPage} from '../chat/chat'
import {SettingsPage} from '../settings/settings'

declare var $:any
declare var L:any

@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage implements AfterViewInit {
  private map: any
  public chatPage: any = ChatPage
  public settingsPage: any = SettingsPage

  constructor(
  	private navController: NavController,
  	public element: ElementRef) {}

  ngAfterViewInit() {
  	this.map = L.map(this.element.nativeElement.lastChild);
  	
  	this.map.setView([37.76, -122.44], 11);
  	this.map.locate({setView: true, maxZoom: 16});

  	L.tileLayer('https://findme.danielscrivano.com/tiles/{z}/{x}/{y}.png').addTo(this.map);
  }
}
