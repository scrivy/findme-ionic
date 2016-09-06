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
					break
					case "updateLocation":
						this.locations[message.data.id] = message.data
					break
					case "oldId":
						this.locations[message.data.NewId] = this.locations[message.data.OldId]
						delete this.locations[message.data.OldId]
					break
				}
				this.eventEmitter.emit(message)
			}
		)
	}

}