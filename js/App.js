define(function(require) {
'use strict';
var spv = require('spv');
var pv = require('pv');
var route = require('./modules/route');
var prepare = require('js/libs/provoda/structure/prepare');
var BrowseMap = require('./libs/BrowseMap');
var navi = require('./libs/navi');
var cache_ajax = require('cache_ajax');

var AppModelBase = require('./models/AppModelBase');
var StartPage = require('./models/StartPage');
var SelectedPoints = require('./models/SelectedPoints');
var initAPIs = require('./initAPIs');

var pvUpdate = pv.update;

var AppRoot = spv.inh(AppModelBase, {
  naming: function(fn) {
    return function AppRoot(opts, version) {
      fn(this, opts, version);
    };
  },
  init: function (self, opts, version) {

    self.app = self;
    self.version = version;
    var app_env = self._highway.env;

    var resortQueue = resortAppQueue(self);

    self.resortQueueFn = resortQueue;
    self.addQueueFn =  initAPIs(self, app_env, cache_ajax, resortQueue);

    self.start_page = self.initChi('start__page');
    self.initMapTree(self.start_page, true, navi);

    handleWindowURL(self, app_env, navi);
  }
}, {
  rpc_legacy: {
    changeSearchHint: function() {
      // pvUpdate(this, 'nice_artist_hint', this.app.popular_artists[(Math.random()*10).toFixed(0)]);
    },
    checkUserInput: function() {
      return;
    },
    search: function(query){
      var old_v = this.state('search_query');
      if (query != old_v){
        if (!query) {
          this.showStartPage();
        } else {
          this.showResultsPage(query);
        }
      }
      pvUpdate(this, 'search_query', query);
    },
  },
  'api-interval_api': function () {
    return setInterval;
  },
  'state-current_minute': [
    ['interval_api'],
    function (update, setInterval) {
      update(Date.now());

      setInterval(function () {
        update(Date.now());
      }, 60 * 1000);
    }
  ],
  model_name: 'app_root',
  checkActingRequestsPriority: function () {},
  trackPage: function () {},
  'chi-start__page': StartPage,
  encodeURLPart: route.encodeURLPart,
  decodeURLPart: route.decodeURLPart,
  joinCommaParts: route.joinCommaParts,
  getCommaParts: route.getCommaParts,
  'probe-loads_search_context_1': {
    main: ['nesting', {
      place_of_current: 'action',
      place_of_nav: null,
    }],
    steps_to_surface_limit: 1,
  },
  sub_page: {
    'pickup-location': {
      constr: SelectedPoints,
      title: [[]],
    },
    'drop_off-location': {
      constr: SelectedPoints,
      title: [[]],
    }
  },
});

function resortAppQueue(app) {
  return function resortQueue(queue) {
    app.resortQueue(queue);
  };
};

function handleWindowURL(self, app_env, navi) {
  if (app_env.needs_url_history){
    navi.init(function(e){
      var url = e.newURL;

      var state_from_history = navi.findHistory(e.newURL);
      if (state_from_history){
        state_from_history.data.showOnMap();
      } else{
        var interest = BrowseMap.getUserInterest(url.replace(/\ ?\$...$/, ''), self.start_page);
        var bwlev = BrowseMap.showInterest(self.map, interest);
        BrowseMap.changeBridge(bwlev);
      }
    });
    (function() {
      var url = window.location && window.location.hash.replace(/^\#/,'');
      if (url){
        navi.hashchangeHandler({
          newURL: url
        }, true);
      } else {
        var bwlev = BrowseMap.showInterest(self.map, []);
        BrowseMap.changeBridge(bwlev);
      }
    })();
  } else {
    var bwlev = BrowseMap.showInterest(self.map, []);
    BrowseMap.changeBridge(bwlev);
  }
}

return prepare(AppRoot);
});
