#! /usr/bin/env node
'use strict';

//TODO: add tests
//TODO: handle major and minor or minor and patches available

//rethink:
// read in json file
// parse for dependencies, add to array
// check for latest version
// parse into categories based on available updates
// write out results

var checkDeps = require('./lib/checkDeps.js');

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

var name = function(p){
  console.log('Checking update status of ' + p.name .red);
  checkDeps(p);
};


name(pkg);


