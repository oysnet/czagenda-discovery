var mdgram=require("mdgram");

var Advertisement = function(service, host, port) {
  this.id = require('uuid').generate();
  this.service = service;
  this.host = host;
  this.port = port;
  this.__tic = null;
  this.__frequency = 1000;
  this.socket=mdgram.createSocket("udp4");

}

Advertisement.prototype.start = function() {
  if(this.__tic !== null) {
    return;
  }
  this.__tic = setInterval(this.__advert.bind(this),this.__frequency);
}

Advertisement.prototype.stop = function() {
  if(this.__tic === null) {
    return;
  }
  clearTimeout(this.__tic);
  this.__tic = null;
  var msg = new Buffer(JSON.stringify({
    id: this.id,
    service: this.service,
    port: this.port,
    host: this.host,
    status: 'down'
  }));
  this.socket.send(msg,0,msg.length,4418,"225.0.0.73");
}

Advertisement.prototype.__advert = function() {
  var msg = new Buffer(JSON.stringify({
    id: this.id,  
    service: this.service,
    port: this.port,
    host: this.host,
    status: 'up'
  }));
  this.socket.send(msg,0,msg.length,4418,"225.0.0.73");
}

exports.Advertisement = Advertisement