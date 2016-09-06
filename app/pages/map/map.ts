import {Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ChatPage} from '../chat/chat'
import {SettingsPage} from '../settings/settings'
import {LocationService} from '../../services/locations/locations'
import {WsService} from '../../services/ws/ws'

declare var $:any
declare var L:any

@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage implements OnInit, AfterViewInit {
  private map: any
  public chatPage: any = ChatPage
  public settingsPage: any = SettingsPage
  private everyone: Object = {}
  private my: any

  constructor(
  	private navController: NavController,
  	public element: ElementRef,
    private locationService: LocationService,
    private wsService: WsService) {}

  ngOnInit() {
    window.navigator.geolocation.watchPosition(
      this.formatAndStorePosition.bind(this),
      function() {
        console.log('geolocation error')
      },
      {enableHighAccuracy: true});
  }

  private formatAndStorePosition(position) {
    let formattedPosition = {
      latlng: [position.coords.latitude, position.coords.longitude],
      accuracy: Math.ceil(position.coords.accuracy)
    };
    this.locationService.position = formattedPosition;
    this.geo_success(formattedPosition);
  }

  private geo_success(position) {
    this.wsService.send('updateLocation', position)
    this.updateMyLocation(position)
  }

  private updateMyLocation(position) {
      if (this.my) {
          this.my.marker.setLatLng(position.latlng);
          this.my.circle.
              setLatLng(position.latlng).
              setRadius(position.accuracy)
          ;
      } else {
          this.my = {
              marker: L.marker(position.latlng, {
                  icon: L.icon({
                      iconUrl: 'img/mymarker.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 40]
                  }),
                  alt: "Me!"
              }).addTo(this.map),
              circle: L.circle(position.latlng, position.accuracy, {
                  fillOpacity: 0.5
              }).addTo(this.map)
          };
      }
      this.redrawLines();
  }

  private redrawLines(id?: string) {
    if (!this.my) return

    if (!id) { // redraw all lines
      for (let id of Object.keys(this.everyone)) {
        this.updateOrCreateLine(this.everyone[id])
      }
    } else {
      this.updateOrCreateLine(this.everyone[id])
    }   
  }

  private updateOrCreateLine(thisGuy: any) {
    if (thisGuy.line) {
      thisGuy.line.
         setLatLngs([
             this.my.marker.getLatLng(),
             thisGuy.marker.getLatLng()
         ])
      ;
    } else {
        thisGuy.line = L.polyline([this.my.marker.getLatLng(), thisGuy.marker.getLatLng()]).addTo(this.map);
    }
  }

  ngAfterViewInit() {
  	this.map = L.map(this.element.nativeElement.lastChild);
  	
  	this.map.setView([37.76, -122.44], 11);
  	this.map.locate({setView: true, maxZoom: 16});

  	L.tileLayer('https://findme.danielscrivano.com/tiles/{z}/{x}/{y}.png').addTo(this.map);

    for (var position of this.locationService.locations) {
      this.updateTheirLocation(position)
    }

  	this.locationService.eventEmitter.subscribe(
  		message => {
  			switch (message.action) {
  				case 'allLocations':
  					for (var position of message.data) {
  						this.updateTheirLocation(position)
  					}
  				break
          case 'updateLocation':
            this.updateTheirLocation(message.data)
            break
          case 'oldId':
            if (this.everyone[message.data.OldId]) {
              this.everyone[message.data.NewId] = this.everyone[message.data.OldId]
              delete this.everyone[message.data.OldId]
            }
            break
          default:
            console.log("did not match a case")
            break
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

    this.redrawLines(position.id)
  }
}
