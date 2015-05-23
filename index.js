#! /usr/bin/env node
'use strict';

var colors = require('colors');
var http = require('http');

var pkg = require('./' + process.argv[2]);
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
  } else {
    console.log('No dev dependencies found');
  }
};

function writeVersion(k, v, c){
  // ~ 1.2.x
  // ^ 1.x.x
  // * anything
  var patch = /^~\d*[.]\d*[.]\d*/;
  var minor = /^\^\d*[.]\d*[.]\d*/;
  var wildcard = '*';
  if(v.match(patch)){
    console.log(k + ' ver: ' + v + ' current: ' + c + ' & patches are accepted');
  }
  if(v.match(minor)){
    console.log(k + ' ver: ' + v + ' current: ' + c + ' & minor updates are accepted');
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

name(pkg);

