const keylogger = require('./build/Release/keyboard-addon.node');

class CharCode {
	static validString (string){
		return string?.length === 1 && !isNaN(this.fromString(string));
	}

	static fromString (string){
		return (string + '').toUpperCase().charCodeAt(0);
	}

	static toString (charCode){
		return String.fromCharCode(charCode);
	}
	
	static jsMapped (charCode){
		switch (charCode){
			case 160: case 161: return 16;
			case 162: case 163: return 17;
			case 164: case 165: return 18;
			default:            return charCode;
		}
	}
}


class KeyboardEvent {
	altKey = false;
	charCode = -1;
	key = null;

	constructor (charCode, options){
		this.altKey = options?.alt == true;
		this.charCode = charCode;
		this.key = CharCode.toString(charCode);
	}
}

class KeyLogger {
	events = {};
	pressed = {};
	options = {};
	#started = false;
	
	start (){
		if (this.#started == true) return;

		this.#started = true;

		keylogger.KeyDown(
			k => this.#handleDown(k),
			k => this.#handleUp(k)
		);

		setInterval(() => {}, 1000);
	}

	keyEvents (key){
		return this.events?.[
			CharCode.toString(
				CharCode.jsMapped(key)
			)
		];
	}

	#handleDown (keyCode){
		if (this.pressed.hasOwnProperty(keyCode))
			return;

		this.pressed[keyCode] = true;

		const keyEvents = this.keyEvents(keyCode);

		if (Array.isArray(keyEvents))
			for (const event of keyEvents)
				event(new KeyboardEvent(keyCode, { ...this.options, down: true }));
	}

	#handleUp (keyCode){
		if (this.pressed.hasOwnProperty(keyCode) != true)
			return;
		
		delete this.pressed[keyCode];

		const keyEvents = this.keyEvents(keyCode);

		if (Array.isArray(keyEvents))
			for (const event of keyEvents)
				event(new KeyboardEvent(keyCode, { ...this.options, down: false }));
	}

	on (key, event){
		key = (key + '').toUpperCase();

		if (CharCode.validString(key) == undefined)
			throw `Invalid Key to listen to (${key})`;

		if (typeof event != 'function')
			throw '(KeyLogger.on) Invalid Event Listener';

		const e = (this.events[key] ??= []);

		if (e.includes(event) != true)
			e.push(event);
	}

	off (key, event){
		key = (key + '').toUpperCase();

		if (CharCode.validString(key) == undefined)
			throw `Invalid Key to turn off (${key})`;

		if (typeof event != 'function')
			throw '(KeyLogger.off) Invalid Event Listener';

		const e = this.events[key];

		if (Array.isArray(e) != true) return;

		while (e.includes(event)){
			const i = e.indexOf(event);

			e.splice(i, 1);
		}
	}
}
const hook = new KeyLogger;

hook.on('a', () => {
	console.log('a was pressed')
});

hook.start();


// keylogger.KeyDown(
// 	k => {
// 		console.log(`Keycode: ${k}, (${CharCode.toString(k)})`)
// 	},
// 	() => {
// 		console.log('released')
// 	}
// );

// Keep the Node.js application running