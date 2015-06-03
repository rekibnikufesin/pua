'use strict';

var http = require('http');
var async = require('async');
var Table = require('cli-table');
var colors = require('colors');

var dependencies = [];

module.exports = function(p) {
async.series([
  function(callback){
    // read package.json into array
    readToArray(p, callback);
  },
  function(callback){
    // get the latest version from npm
    async.each(dependencies, function(d, depCallback){
      //console.log('Getting version info for ' + d.package);
      http.get('http://registry.npmjs.org/'+ d.package+'/latest', function(res){
        var body = '';
        res.on('data', function(data){
          body += data;
        });
        res.on('end', function(){
          var pbody = JSON.parse(body);
          d.latest = pbody.version;
          depCallback();
        })
      })
    }, function(){
      //console.log('latest version async each completed');
      callback();
    })
  },
  function(callback){
    // evaluate for available updates
    async.each(dependencies, function(d, verCallback){
      var cMaj = d.current.split('.')[0];
      cMaj = cMaj.replace('~','').replace('^','');
      var cMin = d.current.split('.')[1];
      var cPatch = d.current.split('.')[2];
      var lMaj = d.latest.split('.')[0];
      var lMin = d.latest.split('.')[1];
      var lPatch = d.latest.split('.')[2];
      if(parseInt(cMaj) < parseInt(lMaj)) {
        d.updates = 'major';
      } else if(parseInt(cMin) < parseInt(lMin)) {
        d.updates = 'minor';
      }else if(parseInt(cPatch) < parseInt(lPatch)) {
        d.updates = 'patch';
      } else {
        d.updates = 'uptodate';
      }
      verCallback();
    }, function(){
      //console.log('updates identified');
      callback();
    })
  },
  function(callback){
    // evaluate type of updates accepted
    async.each(dependencies, function(d, evalCallback){
      var patch = /^~\d*[.]\d*[.]\d*/;
      var minor = /^\^\d*[.]\d*[.]\d*/;
      var locked = /^[^~\^]\d*[.]\d*[.]\d*/;
      var man = /^[a-zA-Z]/;
      var wildcard = /^[*]/;
      if(d.current.match(patch)){
        d.accepts = 'patch';
      }
      if(d.current.match(minor)){
        d.accepts = 'minor';
      }
      if(d.current.match(locked)){
        d.accepts = 'locked';
      }
      if(d.current.match(man)){
        d.accepts = 'manual';
      }
      if(d.current.match(wildcard)){
        d.accepts = 'wildcard';
      }
      evalCallback();
    }, function(){
      //console.log('evaluation async completed')
      callback();
    })
  },
  function(callback){
    // write out results based on status
    async.filter(dependencies, function(item, filteredCB){
      //console.log('checking ' + item.package + ': ' + item.accepts);
      if(item.updates === 'uptodate'){
        return filteredCB(true);
      }
      filteredCB(false);
    }, function(results){
      console.log('The following packages are up to date. Yeah!' .green);
      //console.log(results);
      var table = new Table({
        head: ['Package', 'Section', 'Current', 'Latest' ],
        colWidths: [40, 40, 10, 10]
      });
      async.each(results, function(r, resultCB){
        table.push([r.package, r.dependency, r.current, r.latest]);
        resultCB();
      });
      console.log(table.toString());
      console.log('\n\n\n');
      callback();
    })
  },
  function(callback){
    // write out results based on status
    async.filter(dependencies, function(item, filteredCB){
      //console.log('checking ' + item.package + ': ' + item.accepts);
      if(item.updates === 'major'){
        return filteredCB(true);
      }
      filteredCB(false);
    }, function(results){
      console.log('The following packages have major updates available' .blue);
      //console.log(results);
      var table = new Table({
        head: ['Package', 'Section', 'Current', 'Latest' ],
        colWidths: [40, 40, 10, 10]
      });
      async.each(results, function(r, resultCB){
        table.push([r.package, r.dependency, r.current, r.latest]);
        resultCB();
      });
      console.log(table.toString());
      console.log('\n\n\n');
      callback();
    })
  },
  function(callback){
    // write out results based on status
    async.filter(dependencies, function(item, filteredCB){
      //console.log('checking ' + item.package + ': ' + item.accepts);
      if(item.updates === 'minor'){
        return filteredCB(true);
      }
      filteredCB(false);
    }, function(results){
      console.log('The following packages have minor updates available' .yellow);
      //console.log(results);
      var table = new Table({
        head: ['Package', 'Section', 'Current', 'Latest' ],
        colWidths: [40, 40, 10, 10]
      });
      async.each(results, function(r, resultCB){
        table.push([r.package, r.dependency, r.current, r.latest]);
        resultCB();
      });
      console.log(table.toString());
      console.log('\n\n\n');
      callback();
    })
  },
  function(callback){
    // write out results based on status
    async.filter(dependencies, function(item, filteredCB){
      //console.log('checking ' + item.package + ': ' + item.accepts);
      if(item.updates === 'patch'){
        return filteredCB(true);
      }
      filteredCB(false);
    }, function(results){
      console.log('The following packages have patches available');
      //console.log(results);
      var table = new Table({
        head: ['Package', 'Section', 'Current', 'Latest' ],
        colWidths: [40, 40, 10, 10]
      });
      async.each(results, function(r, resultCB){
        table.push([r.package, r.dependency, r.current, r.latest]);
        resultCB();
      });
      console.log(table.toString());
      console.log('\n\n\n');
      callback();
    })
  },
  function(callback){
    // write out results based on status
    async.filter(dependencies, function(item, filteredCB){
      //console.log('checking ' + item.package + ': ' + item.accepts);
      if(item.accepts === 'wildcard'){
        return filteredCB(true);
      }
      filteredCB(false);
    }, function(results){
      console.log('Seriously dude? Wildcards? Go sit your ass in the corner and think about what you did.' .red);
      //console.log(results);
      var table = new Table({
        head: ['Package', 'Section', 'Current', 'Latest' ],
        colWidths: [40, 40, 10, 10]
      });
      async.each(results, function(r, resultCB){
        table.push([r.package, r.dependency, r.current, r.latest]);
        resultCB();
      });
      console.log(table.toString());
      callback();
    })
  }
], function(){
  console.log('async series completed');
  //console.log(dependencies);
})
};

var readToArray = function(p, callback){
  if(p.devDependencies){
    for(var dep in p.devDependencies){
      dependencies.push({'package': dep, 'dependency': 'devDependencies', 'current': p.devDependencies[dep]});
    }
  }
  if(p.dependencies){
    for(var dep in p.dependencies){
      dependencies.push({'package': dep, 'dependency': 'dependencies', 'current': p.dependencies[dep]});
    }
  }
  if(p.peerDependencies){
    for(var dep in p.peerDependencies){
      dependencies.push({'package': dep, 'dependency': 'peerDependencies', 'current': p.peerDependencies[dep]});
    }
  }
  if(p.bundledDependencies){
    for(var dep in p.bundledDependencies){
      dependencies.push({'package': dep, 'dependency': 'bundledDependencies', 'current': p.bundledDependencies[dep]});
    }
  }
  if(p.optionalDependencies) {
    for (var dep in p.optionalDependencies) {
      dependencies.push({'package': dep, 'dependency': 'optionalDependencies', 'current': p.optionalDependencies[dep]});
    }
  }
  callback(null, '1');
};

function wildcards(param){
  return param.accepts === '*';
}