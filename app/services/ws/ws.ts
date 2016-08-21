import { Injectable, EventEmitter } from '@angular/core'

@Injectable()
export class WsService {
	private ws: any
	public eventEmitter: EventEmitter<any> = new EventEmitter()

	constructor() {
		this.tryConnecting()
		setInterval(this.checkConnection.bind(this), 2000)
	}


	private checkConnection() {
		if (this.ws.readyState > 1) {
			console.log('webSocket closed: attempting another connection')
			this.tryConnecting()
		}
	}

	private tryConnecting() {
//        this.ws = new WebSocket('wss://findme.danielscrivano.com/ws');
        this.ws = new WebSocket('ws://findme.danielscrivano.com:5000/ws');
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

            if (!message.action || !message.data) return console.error('webSocket error: no action or data property from incoming message');

            console.log(message.action, message.data);

            this.eventEmitter.emit(message)
//            if (handlers[message.action]) {
//                handlers[message.action].forEach(function(fn) {
//                    fn(message.data);
//                });
//            } else {
//                console.error('webSocket error: no handlers for action: ' + message.action);
//            }
		}

        this.ws.onerror = function() {
            console.error('webSocket error: onerror cb');
        }

        this.ws.onclose = function() {
            console.error('webSocket error: onclose cb');
        }
	}

    public send(action, data) {
        let message
        try {
            message = JSON.stringify({ action: action, data: data});
        } catch(e) {
            console.log('webSocket error: json stringify error on send :',e);
            return;
        };

        switch (this.ws.readyState) {
            case 0: // connecting
                console.log('webSocket: connecting');
                break;
            case 1: // open
                this.ws.send(message);
                break;
            case 2: // closing
            case 3: // closed
                console.error('webSocket: closing or closed');
                break;
        };
    }
}