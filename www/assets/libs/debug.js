//<div id="_log" style="height: 300px; overflow-y:auto; position:fixed; top: 200px; left: 0; color: red;z-index: 100000000000000000;"></div>

const { log, info, error } = console;
console.log = (...arg) => {
    setTimeout(() => {
        document.getElementById('_log').innerHTML += 'LOG: ' + arg + '<br>';
        log.call(console, ...arg);
    }, 500);
};
console.error = (...arg) => {
    setTimeout(() => {
        document.getElementById('_log').innerHTML += 'ERROR: ' + arg + '<br>';
        log.call(console, ...arg);
    }, 500);
};
console.warn = (...arg) => {
    setTimeout(() => {
        document.getElementById('_log').innerHTML += 'WARN: ' + arg + '<br>';
        log.call(console, ...arg);
    }, 500);
};
console.info = (...arg) => {
    setTimeout(() => {
        document.getElementById('_log').innerHTML += 'INFO: ' + arg + '<br>';
        log.call(console, ...arg);
    }, 500);
};
