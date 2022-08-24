export default class ScanListener {

	static triple(type, callback) {
		return new ScanListener(type, callback).setAction();
	}

	static single(type, callback) {
		return new ScanListener(type, callback);
	}

	constructor(type, callback, shouldCallback = () => true) {
		this.callback = callback;
		this.type = type;
		this.shouldCallback = shouldCallback;
		this.history = [];
	}

	setAction(minScans = 3, withinMilliseconds = 1000) {
		this.shouldCallback = scan => {
			const now = Date.now();
			const scans = this.history.slice(-minScans).filter(historyScan => historyScan.rawBarcode === scan.rawBarcode && this.type.matches(historyScan.rawBarcode));

			if (scans.length !== minScans) {
				return false;
			}

			const oldest = scans[0];
			const tooSlow = now - oldest.scannedAt.getTime() >= withinMilliseconds;

			if (tooSlow) {
				return false;
			}

			this.history = [];

			return true;
		}

		return this;
	}

	handleScan(scan) {
		if (this.type.matches(scan.rawBarcode)) {
			this.history.push(scan);

			if (!this.shouldCallback(scan)) {
				return;
			}

			this.callback(this.type.get(scan.rawBarcode));
		}
	}
}
