import { Injectable, NgZone } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTracker {
//	public watch: any
//	public lat: number = 0;
//	public lng: number = 0;
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' })

	constructor(
		public zone: NgZone,
		private http: Http) {}

	startTracking() {
		let config = {
			desiredAccuracy: 0,
			stationaryRadius: 3,
			distanceFilter: 3, 
			debug: false,
			interval: 10000 
		}

		BackgroundGeolocation.configure(
			(location) => {
				console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude + ', accuracy: ' + location.accuracy);

				this.http.post(
					'https://findme.danielscrivano.com/update',
					JSON.stringify({
						id: localStorage.getItem("id"),
						latlng: [location.latitude, location.longitude],
						accuracy: Math.ceil(location.accuracy)
					}),
					{headers: this.headers}
				).subscribe(
					() => {
						// do nothing?
						console.log("background success")
					},
					(err) => {
						console.error("background http error: ", err)
					}
				)

				// Run update inside of Angular's zone
//				this.zone.run(() => {
//					this.lat = location.latitude;
//					this.lng = location.longitude;
//				});
			}, (err) => {
				console.log('backgroundGeolocation error:', err);
			}, config)

		BackgroundGeolocation.start()

		setTimeout(function() {
			console.log('stopping background tracking')
			BackgroundGeolocation.finish()
		}, 600000)

/*
		// Foreground Tracking
		let options = {
			frequency: 3000, 
			enableHighAccuracy: true
		}

		this.watch = Geolocation.watchPosition(options)
			.filter((p: any) => p.code === undefined)
			.subscribe(
				(position: Geoposition) => {
					console.log(position);

					// Run update inside of Angular's zone
					this.zone.run(
						() => {
							this.lat = position.coords.latitude;
							this.lng = position.coords.longitude;
						}
					);
				}
			)
*/
	}

	stopTracking() {
		console.log('stopTracking')

		BackgroundGeolocation.finish()
// this.watch.unsubscribe()
	}
}