function KeyCodeName (keyCode){
	switch (keyCode){
		default: return String.fromCharCode(keyCode);
		case 8: return 'backspace'; //  backspace
		case 9: return 'tab'; //  tab
		case 13: return 'enter'; //  enter
		case 16: return 'shift'; //  shift
		case 17: return 'ctrl'; //  ctrl
		case 18: return 'alt'; //  alt
		case 19: return 'pause/break'; //  pause/break
		case 20: return 'caps lock'; //  caps lock
		case 27: return 'escape'; //  escape
		case 33: return 'page up'; // page up, to avoid displaying alternate character and confusing people	         
		case 34: return 'page down'; // page down
		case 35: return 'end'; // end
		case 36: return 'home'; // home
		case 37: return 'left arrow'; // left arrow
		case 38: return 'up arrow'; // up arrow
		case 39: return 'right arrow'; // right arrow
		case 40: return 'down arrow'; // down arrow
		case 45: return 'insert'; // insert
		case 46: return 'delete'; // delete
		case 91: case 92: return 'meta'; // meta
		case 93: return 'select key'; // select key
		case 96: return 'numpad 0'; // numpad 0
		case 97: return 'numpad 1'; // numpad 1
		case 98: return 'numpad 2'; // numpad 2
		case 99: return 'numpad 3'; // numpad 3
		case 100: return 'numpad 4'; // numpad 4
		case 101: return 'numpad 5'; // numpad 5
		case 102: return 'numpad 6'; // numpad 6
		case 103: return 'numpad 7'; // numpad 7
		case 104: return 'numpad 8'; // numpad 8
		case 105: return 'numpad 9'; // numpad 9
		case 106: return 'multiply'; // multiply
		case 107: return 'add'; // add
		case 109: return 'subtract'; // subtract
		case 110: return 'decimal point'; // decimal point
		case 111: return 'divide'; // divide
		case 112: return 'F1'; // F1
		case 113: return 'F2'; // F2
		case 114: return 'F3'; // F3
		case 115: return 'F4'; // F4
		case 116: return 'F5'; // F5
		case 117: return 'F6'; // F6
		case 118: return 'F7'; // F7
		case 119: return 'F8'; // F8
		case 120: return 'F9'; // F9
		case 121: return 'F10'; // F10
		case 122: return 'F11'; // F11
		case 123: return 'F12'; // F12
		case 144: return 'num lock'; // num lock
		case 145: return 'scroll lock'; // scroll lock
		case 186: return ';'; // semi-colon
		case 187: return '='; // equal-sign
		case 188: return ','; // comma
		case 189: return '-'; // dash
		case 190: return '.'; // period
		case 191: return '/'; // forward slash
		case 192: return '`'; // grave accent
		case 219: return '['; // open bracket
		case 220: return '\\'; // back slash
		case 221: return ']'; // close bracket
		case 222: return "'"; // single quote
	}
}

class CharCode {
	static toString (charCode){
		return KeyCodeName(this.jsMapped(charCode));
	}
	
	static jsMapped (charCode){
		switch (charCode){
			case 160: case 161: return 16;
			case 162: case 163: return 17;
			case 164: case 165: return 18;
			default:            return charCode;
		}
	}
};

exports.CharCode = CharCode;

exports.KeyboardEvent = class KeyboardEvent {
	down = null;
	charCode = -1;
	key = null;

	altKey = false;
	ctrlKey = false;
	metaKey = false;
	shiftKey = false;

	constructor (charCode, options){
		this.charCode = charCode;
		this.key = CharCode.toString(charCode).toLowerCase();

		this.down = options?.down == true;

		this.altKey = options?.alt == true;
		this.ctrlKey = options?.ctrl == true;
		this.metaKey = options?.meta == true;
		this.altshiftey = options?.shift == true;
	}
};