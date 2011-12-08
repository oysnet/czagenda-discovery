#!/usr/bin/env node
spawn = require("child_process").spawn,
  sys = require("sys"),
  Advertisement = require('./advertisement').Advertisement;

var path = require("path")
  , args = process.argv.slice(1)

var arg, base;
do arg = args.shift();
while ( arg !== __filename
  && (base = path.basename(arg)) !== "discovery-run"
)
signature = args.shift();
host = args.shift();
port = args.shift();

run(args.shift(),args);
a = new Advertisement(signature,host,port);
a.start();
function run(exec,args) {
  var child = spawn(exec, args);
  child.stdout.addListener("data", function (chunk) { chunk && sys.print(chunk) });
  child.stderr.addListener("data", function (chunk) { chunk && sys.debug(chunk) });
  child.addListener("exit", function () { run(exec,args) });
}
