const { CharCode, KeyboardEvent } = require('./utils.js');
const { Worker, isMainThread } = require('worker_threads');

const instances = [];

if (isMainThread){
	const worker = new Worker(__dirname + '/worker.js', { workerData: 42 });
	
	worker.on('message', (result) => {
		for (const instance of instances)
			instance.handleKey(result.key, result.down == true);
	});

	worker.postMessage('start');
}

// Keep keyboard alive
setInterval(() => {}, 1000);

class NodeKeyboard {
	events = [];
	pressed = {};
	options = {
		alt: false,
		ctrl: false,
		meta: false,
		shift: false
	};

	#started = false;

	constructor (){
		instances.push(this);
	}

	kill (){
		instances = instances.filter(i => i != this);
		this.events = [];
	}
	
	start (){
		if (this.#started == true) return;
		instances.push(this);

		this.#started = true;
	}

	handleKey (keyCode, down){
		if (this.pressed.hasOwnProperty(keyCode) == down) return;

		if (down) this.pressed[keyCode] = true;
		else delete this.pressed[keyCode];

		switch (CharCode.toString(keyCode)){
			case 'alt': this.options.alt = down; break;
			case 'ctrl': this.options.ctrl = down; break;
			case 'meta': this.options.meta = down; break;
			case 'shift': this.options.shift = down; break;
		}

		if (Array.isArray(this.events))
			for (const event of this.events)
				event(new KeyboardEvent(keyCode, { ...this.options, down: down }));
	}

	on (event){
		if (typeof event != 'function')
			throw '(KeyLogger.on) Invalid Event Listener';

		if (this.events.includes(event) != true)
			this.events.push(event);
	}

	off (event){
		if (typeof event != 'function')
			throw '(KeyLogger.off) Invalid Event Listener';

		if (Array.isArray(this.events) != true) return;

		while (this.events.includes(event)){
			const i = this.events.indexOf(event);

			this.events.splice(i, 1);
		}
	}
}

module.exports = NodeKeyboard;