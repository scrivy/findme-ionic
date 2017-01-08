import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { BackgroundGeolocation } from 'ionic-native';

@Injectable()
export class LocationTracker {
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' })

	constructor(
		private http: Http) {}

	startTracking() {
		let config = {
			desiredAccuracy: 1,
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
				// ios only
//				BackgroundGeolocation.finish()
			}, (err) => {
				console.log('backgroundGeolocation error:', err);
			}, config)

		BackgroundGeolocation.start()
	}

	stopTracking() {
		console.log('stopTracking')
		BackgroundGeolocation.stop()
	}
}