# WARNING

> I have no clue what i'm doing, use that at your own free will

Example:
```js
// Very similar to keydown listener in vanilla js
const NodeKeyboard = require('@orago/node-keyboard');

const hook = new NodeKeyboard;

hook.on((event) => {
	if (event.ctrlKey && event.altKey && event.key == 'x' && event.down){
		console.log('yes!');
	}
});

// Don't start until the rest of your code is loaded or else it will block the main thread
hook.start();
```