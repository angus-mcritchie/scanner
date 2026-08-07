import ScanListener from './ScanListener.js';
import ScanType from './ScanType.js';

export default class Scanner {

	// Fields a person types into, which the scanner must keep its hands off.
	//
	// `js-disable-barcode-scan` was missing its dot, so it read as a type selector
	// for an element nobody has and the list was really just `input`. Every opt-out
	// using that class happened to be an <input> too, so it went unnoticed until a
	// <textarea> tried to use it: every character typed was appended to the barcode
	// buffer, and the Enter ending a line fired the lot as a scan.
	static ignoreSelector = 'input, textarea, select, [contenteditable="true"], .js-disable-barcode-scan';
	static ignoreKeys = ['Shift', 'Unidentified'];
	static finishKey = 'Enter';

	static triple(callback, type = ScanType.any()) {
		return new Scanner(ScanListener.triple(type, callback)).listen();
	}

	static single(callback, type = ScanType.any()) {
		return new Scanner(ScanListener.single(type, callback)).listen();
	}

	constructor(listener) {
		this.input = '';
		this.enabled = true;
		this.listeners = listener ? [listener] : [];
		this.emptyScanListeners = [];
	}

	addListener(listener) {
		this.listeners.push(listener);
		return this;
	}

	onEmptyScan(callback) {
		this.emptyScanListeners.push(callback);
		return this;
	}

	listen(context = document.body) {
		context.addEventListener('keypress', this.handleKeyUp.bind(this));
		return this;
	}

	blurButtonIfFocused() {
		/^(BUTTON|A)$/i.test(document.activeElement.tagName) && document.activeElement.blur();
		return this;
	}

	handleKeyUp({ key, target }) {
		if (!this.enabled || Scanner.ignoreKeys.includes(key)) {
			return;
		}

		this.blurButtonIfFocused();

		// Don't add to scanner input if we're typing into an ignored field (like an input)
		if (target.matches(Scanner.ignoreSelector) || target.closest(Scanner.ignoreSelector)) {
			this.input = '';
			return;
		}

		// add the key to the scanner input to build the barcode
		if (key !== Scanner.finishKey) {
			this.input += key;
			return;
		}

		// don't do anything if the scanner input is empty
		if (this.input === '') {
			this.handleEmptyScan();
			return;
		}

		this.handleScan();

		// reset the scanner input, ready for next time
		this.input = '';
	}

	handleEmptyScan() {
		this.emptyScanListeners.forEach(callback => callback());
	}

	handleScan() {
		const entry = {
			rawBarcode: this.input,
			scannedAt: new Date(),
		}

		this.listeners.forEach(listener => listener.handleScan(entry));
	}

	enable() {
		this.enabled = true;
		return this;
	}

	disable() {
		this.enabled = false;
		return this;
	}
}
