Scanner
=
Used to detect scans from a barcode scanner. Also allows for custom actions when 3 identical scans within 1 second are detected.

Installation
-

Using NPM:

```bash
npm install @gooby/scanner
```

Quick Start
-------
```php
import { Scanner } from '@gooby/scanner';

Scanner.triple(console.log); // scan the same barcode 3 times within 1 second
Scanner.single(console.log); // scan any barcode
```

Ignored fields
-

The scanner listens on the whole document, so it deliberately keeps out of
anything a person types into: `input`, `textarea`, `select` and
`contenteditable`. Keys pressed in those are not added to the barcode buffer,
and the Enter that ends a line does not fire a scan.

To opt anything else out, give it the `js-disable-barcode-scan` class:

```html
<div class="js-disable-barcode-scan" contenteditable="true"></div>
```

Or replace the list entirely — it is a static, so it can be set once at boot:

```js
Scanner.ignoreSelector = 'input, textarea, .js-disable-barcode-scan, .my-widget';
```
