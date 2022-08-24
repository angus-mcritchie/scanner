export default class ScanType {

	static any() {
		return new ScanType('any', () => true);
	}

	static fromPrefix(id, prefix) {
		return new ScanType(id, rawBarcode => new RegExp(`^${prefix}`, 'i').test(rawBarcode), rawBarcode => rawBarcode.substring(prefix.length));
	}

	constructor(id, matches = () => { }, clean = barcode => barcode) {
		this.id = id;
		this.matches = matches;
		this.clean = clean;
	}

	get(barcode) {
		return {
			type: this.id,
			barcode: this.clean(barcode)
		}
	}
}
