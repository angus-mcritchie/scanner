import ScanListener from './ScanListener.js';
import ScanType from './ScanType.js';

export default class Scanner {

	static ignoreSelector = 'input, js-disable-barcode-scan';
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
	}

	addListener(listener) {
		this.listeners.push(listener);
		return this;
	}

	listen(context = document.body) {
		context.addEventListener('keyup', this.handleKeyUp.bind(this));
		return this;
	}

	blurButtonIfFocused() {
		document.activeElement.tagName === 'BUTTON' && document.activeElement.dispatchEvent(new Event('blur'));
		return this;
	}

	handleKeyUp({ key, target }) {
		if (!this.enabled || Scanner.ignoreKeys.includes(key)) {
			return;
		}

		this.blurButtonIfFocused();

		// Don't add to scanner input if we're typing into an ignored field (like an input)
		if (target.closest(Scanner.ignoreSelector)) {
			return this.input = '';
		}

		// add the key to the scanner input to build the barcode
		if (key !== Scanner.finishKey) {
			return this.input += key;
		}

		// don't do anything if the scanner input is empty
		if (this.input === '') {
			return;
		}

		this.handleScan();

		// reset the scanner input, ready for next time
		this.input = '';
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
