import { Injectable, EventEmitter } from '@angular/core'
import { WsService } from '../ws/ws'

@Injectable()
export class LocationService {
	public locations: Object[] = []
	public position: any
	public eventEmitter: EventEmitter<any> = new EventEmitter()

	constructor(private ws: WsService) {
		this.ws.eventEmitter.subscribe(
			message => {
				switch (message.action) {
					case "allLocations":
						this.locations = message.data
						this.eventEmitter.emit(message)
					break
					case "updateLocation":
						this.locations[message.data.id] = message.data
						this.eventEmitter.emit(message)
					break
				}
			}
		)
	}

}