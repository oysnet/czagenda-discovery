var mdgram=require("mdgram"),
    events = require('events'),
    util = require("util");


var Browser = function(service) {
  this.service = service;
  this.socket=mdgram.createSocket("udp4");
  this.socket.on('message', this.__message.bind(this));
  this.socket.on("listening",function() { this.joinGroup("225.0.0.73"); });
  this.socket.bind(4418);
  this.__known = {}
}

util.inherits(Browser, events.EventEmitter);

Browser.prototype.__message = function(data,remote) {
  try {
    var message = JSON.parse(data.toString());
  } catch(e) {
    //wrong message
    console.log(e);
    return;
  }
  if(typeof(message.service) !== 'undefined' && message.service == this.service) {
    if(typeof(message.status) !== 'undefined' && message.status == 'up') {
      delete message.status;
      if(typeof(this.__known[message.id]) === 'undefined') {
          this.emit("up", message);
          this.__known[message.id] = {
              tic : setTimeout(function() { this.__setDown(message.id);}.bind(this),2000),
              message : message
            }
      } else {
        clearTimeout(this.__known[message.id].tic);
        this.__known[message.id].tic = setTimeout(function() { this.__setDown(message.id);}.bind(this),2000);
      }
    } else {
      delete message.status;
      if(typeof(this.__known[message.id]) !== 'undefined') {
        this.__setDown(message.id);
      }
    }
  }
}

Browser.prototype.__setDown = function(key) {
  clearTimeout(this.__known[key].tic);
  var message = this.__known[key].message
  delete this.__known[key];
  this.emit("down", message);
}

exports.Browser = Browser