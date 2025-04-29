import Scanner from './Scanner.js';

Scanner.triple(logTripleScan); // scan the same barcode 3 times within 1 second
Scanner.single(logSingleScan); // scan any barcode

function logTripleScan(scan) {
    console.log('3️⃣', scan);
    document.querySelector('#triple-scan-log').appendChild(scanToElement(scan));
}

function logSingleScan(scan) {
    console.log('1️⃣', scan);
    document.querySelector('#single-scan-log').appendChild(scanToElement(scan));
}

function scanToElement(scan) {
    const div = document.createElement('div');
    div.innerText = new Date().toLocaleString() + '\n\n' + JSON.stringify(scan, null, 4);
    div.classList.add('scan');

    return div;
}