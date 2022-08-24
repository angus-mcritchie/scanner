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