import { Injectable, EventEmitter } from '@angular/core'

@Injectable()
export class WsService {
	private ws: any
	public eventEmitter: EventEmitter<any> = new EventEmitter()

	constructor() {
		this.tryConnecting()
		setInterval(this.checkConnection.bind(this), 5000)
	}


	private checkConnection() {
		if (this.ws.readyState > 1) {
			console.log('webSocket closed: attempting another connection')
			this.tryConnecting()
		}
	}

	private tryConnecting() {
        this.ws = new WebSocket('wss://findme.danielscrivano.com/ws');

        this.ws.onopen = () => {
//            console.log('webSocket: opened');

//            if (geoLocate.position) {
//                var message;
//                try {
//                    message = JSON.stringify({ action: 'updateLocation', data: geoLocate.position});
//                } catch(e) {
//                    console.log('webSocket error: json stringify error on send :',e);
//                    return;
//                };

//                this.send(message);
//            }

        };

        this.ws.onmessage = (event) => {
        	let message
            try {
                message = JSON.parse(event.data);
            } catch(e) {
                console.error(e.message);
                console.error('raw message: ');
                console.error(event);
                return;
            }
//            console.log('webSocket message: ', message);

            if (!message.action || !message.data) return console.error('webSocket error: no action or data property from incoming message');

            this.eventEmitter.emit(message)
//            if (handlers[message.action]) {
//                handlers[message.action].forEach(function(fn) {
//                    fn(message.data);
//                });
//            } else {
//                console.error('webSocket error: no handlers for action: ' + message.action);
//            }
		}
	}
}