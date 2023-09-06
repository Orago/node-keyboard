const { workerData, parentPort } = require('worker_threads');
const keylogger = require('../build/Release/keyboard-addon.node');

let started = false;

parentPort.on('message', (message) => {
	if (message == 'start' && !started){
		started = true;

		keylogger.KeyDown(
			key => parentPort.postMessage({ key, down: true }),
			key => parentPort.postMessage({ key, down: false })
		);
	}
});
