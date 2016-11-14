import { Platform } from 'ionic-angular'
import {Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocationService} from '../../services/locations/locations'
import {WsService} from '../../services/ws/ws'

declare var $:any
declare var L:any

@Component({
  templateUrl: 'map.html'
})
export class MapPage implements OnInit, AfterViewInit {
  private map: any
  private everyone: Object = {}
  private my: any
  private watchId: any
  private fadeIntervalId: any

  constructor(
  	private navController: NavController,
  	public element: ElementRef,
    private locationService: LocationService,
    private wsService: WsService,
    private platform: Platform) {
      platform.pause.subscribe(() => {
        this.pause()
      })
      platform.resume.subscribe(() => {
        this.resume()
      })
  }

  ngOnInit() {
    this.resume()
  }

  private resume() {
    this.watchId = window.navigator.geolocation.watchPosition(
      this.formatAndStorePosition.bind(this),
      function() {
        console.log('geolocation error')
      },
      {enableHighAccuracy: true}
    );

    this.fadeIntervalId = setInterval(this.fadeEveryone.bind(this), 30000)
  }

  private pause() {
    window.navigator.geolocation.clearWatch(this.watchId)
    clearInterval(this.fadeIntervalId)
  }

  private fadeEveryone() {
    Object.keys(this.everyone)
      .forEach((id) => {
        var person = this.everyone[id],
          opacity = person.circle.options.opacity;

        if (opacity > 0) {
          person.circle.setStyle({ opacity: opacity - 0.05});
          person.marker.setOpacity(person.marker.options.opacity - 0.1)
        } else {
          this.map.removeLayer(person.circle);
          this.map.removeLayer(person.marker);
          this.map.removeLayer(person.line);
          delete this.everyone[id];
        }
      })
    ;
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
                      iconUrl: 'assets/mymarker.png',
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
              if (position.id != this.wsService.id) {
                this.updateTheirLocation(position)
              }
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
