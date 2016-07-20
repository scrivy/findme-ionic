import {Component, AfterViewInit, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatPage} from '../chat/chat'
import {SettingsPage} from '../settings/settings'
import {LocationsService} from '../../services/locations/locations'

declare var $:any
declare var L:any

@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage implements AfterViewInit {
  private map: any
  public chatPage: any = ChatPage
  public settingsPage: any = SettingsPage
  private everyone: Object = {}

  constructor(
  	private navController: NavController,
  	public element: ElementRef,
    private locationService: LocationsService) {}

  ngAfterViewInit() {
  	this.map = L.map(this.element.nativeElement.lastChild);
  	
  	this.map.setView([37.76, -122.44], 11);
  	this.map.locate({setView: true, maxZoom: 16});

  	L.tileLayer('https://findme.danielscrivano.com/tiles/{z}/{x}/{y}.png').addTo(this.map);

  	this.locationService.eventEmitter.subscribe(
  		message => {
  			switch (message.action) {
  				case 'allLocations':
  					for (var position of message.data) {
  						this.updateTheirLocation(position)
  					}
  				break
          default:
            console.log(message)
  			}
  		}
  	)
  }

  private updateTheirLocation(position) {
	if (!this.everyone[position.id]) {
		this.everyone[position.id] = {
			marker: L.marker(position.latlng).addTo(this.map),
			circle: L.circle(position.latlng, position.accuracy).addTo(this.map),
			trail: L.polyline([position.latlng]).addTo(this.map),
			line: null,
		}
	} else {
		let thisGuy = this.everyone[position.id];

        thisGuy.marker.
            setLatLng(position.latlng).
            setOpacity(1);

        thisGuy.circle.
            setLatLng(position.latlng).
            setRadius(position.accuracy).
            setStyle({opacity: 0.5});

        thisGuy.trail.
            addLatLng(position.latlng);
	}
  }
}
