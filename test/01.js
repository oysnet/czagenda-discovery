var czdiscovery = require('../index');

//console.log(process.env)    
    
var b = new czdiscovery.Browser('test-discovery');
var a = new czdiscovery.Advertisement('test-discovery','localhost','3000');
a.start();
setTimeout(function() {a.stop();},5000);

b.on('up', function(data) {console.log('Up: ',data)})
b.on('down', function(data) {console.log('Down: ',data)})