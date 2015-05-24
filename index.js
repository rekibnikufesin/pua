#! /usr/bin/env node
'use strict';

//TODO: extract functions into files
//TODO: add tests
//TODO: group results into categories:
// no updates
// patches available and accepted
// patches available but blocked
// minor available and accepted
// minor available but blocked
// major available and accepted
// major available but blocked
// modules manually controlled
// modules with wildcards

var colors = require('colors');
var http = require('http');

var pkg;
if(!process.argv[2]){
  console.log('Please include the path to a package.json file to analyze'.red);
}
if(process.argv[2].match(/^[^.\/]/)){
  // must not be a relative or absolute path
  pkg = require('./' + process.argv[2]);
} else {
  pkg = require(process.argv[2]);
}

var depList = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'bundledDependencies',
  'optionalDependencies'
];

var name = function(p){
  console.log('Checking update status of ' + p.name .red);
  checkDeps(p);
};

var checkDeps = function(p){
  if(p.devDependencies){
    for(var dep in p.devDependencies){
      if(p.devDependencies[dep][0] === '*'){
        var str = 'A wildcard version match on ' + dep + '? Seriously, I hope this is not production code!';
        console.log(str.red);
      }
      getVersion(dep, p.devDependencies[dep], writeVersion);
    }
  }
};

function writeVersion(k, v, c){
  // ~ 1.2.x --patch
  // ^ 1.x.x -- minor
  // * anything
  var patch = /^~\d*[.]\d*[.]\d*/;
  var minor = /^\^\d*[.]\d*[.]\d*/;
  var locked = /^[^~\^]\d*[.]\d*[.]\d*/;
  var man = /^[a-zA-Z]/;
  if(v.match(patch)){
    console.log(k + ' ver: ' + v + ' current: ' + c + ' & patches are accepted');
    var update = evalVersion(v,c);
    if(update === 'major') { console.log('Major updates are available'.red) }
    if(update === 'minor') { console.log('Minor updates are available'.green) }
    if(update === 'patch') { console.log('Patches are available'.blue) }
  }
  if(v.match(minor)){
    console.log(k + ' ver: ' + v + ' current: ' + c + ' & minor updates are accepted');
    var update = evalVersion(v,c);
    if(update === 'major') { console.log('Major updates are available'.red) }
    if(update === 'minor') { console.log('Minor updates are available'.green) }
    if(update === 'patch') { console.log('Patches are available'.blue) }
  }
  if(v.match(locked)){
    console.log(k + ' ver: ' + v + ' current: ' + c + ' & locked at that version');
    var update = evalVersion(v,c);
    if(update === 'major') { console.log('Major updates are available'.red) }
    if(update === 'minor') { console.log('Minor updates are available'.green) }
    if(update === 'patch') { console.log('Patches are available'.blue) }
  }
  if(v.match(man)){
    console.log(k + ' is from ' + v + '. Updates may be available, but that is your job.');
  }
}

function getVersion(k, v, cb){
  http.get('http://registry.npmjs.org/'+k+'/latest', function(res){
    var body = '';
    res.on('data', function(d){
      body += d;
    });
    res.on('end', function(){
      var parsedBody = JSON.parse(body);
      cb(k, v, parsedBody.version);
    })
  })
};

function evalVersion(cur, latest){
  var cMaj = cur.split('.')[0];
  cMaj = cMaj.replace('~','').replace('^','');
  var cMin = cur.split('.')[1];
  var cPatch = cur.split('.')[2];
  var lMaj = latest.split('.')[0];
  var lMin = latest.split('.')[1];
  var lPatch = latest.split('.')[2];
  if(cMaj < lMaj) { return 'major' }
  if(cMin < lMin) { return 'minor' }
  if(cPatch < lPatch) { return 'patch' }
}

name(pkg);

