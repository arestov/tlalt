define(function(require){
'use strict';

var spv = require('spv');
var hp = require('../helpers');

var getUnprefixed = spv.getDeprefixFunc( 'state-' );
var hasPrefixedProps = hp.getPropsPrefixChecker( getUnprefixed );


var StateBindDeclr = function (data, state_name) {
  this.state_name = state_name;
  this.apis = spv.toRealArray(data[0]);
  this.fn = data[1];
};

return function(self, props) {
  if (!hasPrefixedProps(props)){
    return;
  }
  var prop;

  var build_index = self._build_cache_interfaces;
  self._build_cache_interfaces = {};

  self._interfaces_to_states_index = {};

  var all_states_instrs = [];
  for (prop in self) {
    var state_name = getUnprefixed(prop);
    if (!state_name) {continue;}
    var item;
    if (props.hasOwnProperty(prop)) {
      var cur = self[prop];
      item = cur && new StateBindDeclr(cur, state_name);
    } else {
      item = build_index[state_name];
    }
    self._build_cache_interfaces[state_name] = item;
    all_states_instrs.push(item);

  }
  var index = {};
  for (var i = 0; i < all_states_instrs.length; i++) {
    var apis = all_states_instrs[i].apis;
    for (var b = 0; b < apis.length; b++) {
      var name = apis[b];
      if (!index[name]) {
        index[name] = [];
      }
      index[name].push(all_states_instrs[i]);
    }
  }
  self._interfaces_to_states_index = index;
};
});
