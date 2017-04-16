define(function(require) {
'use strict';
var pv = require('pv');
var spv = require('spv');
var $ = require('jquery');
var app_env = require('env');
var FuncsQueue = require('js/libs/FuncsQueue');
var nav = require('./nav');
var map_slice_by_model = require('./pages/index');
var AppBaseView = require('./AppBaseView');
var WPBox = require('./modules/WPBox');
var view_serv = require('view_serv');
var View = require('View');
var arrowsKeysNav = require('./utils/arrowsKeysNav');

var pvUpdate = pv.update;

function initRootView(root_view) {
	root_view.all_queues = [];
    var addQueue = function() {
      this.reverse_default_prio = true;
      root_view.all_queues.push(this);
      return this;
    };
    var resortQueue = function(queue) {
      root_view.resortQueue(queue);
    };

    root_view.somedomain_imgq = new FuncsQueue({
      time: [700],
      init: addQueue,
      resortQueue: resortQueue
    });
}
var AppExposedView = spv.inh(AppBaseView.BrowserAppRootView, {}, {
  location_name: 'exposed_root_view',
  'stch-doc_title': function(target, title) {
    target.d.title = title || "";
  },
  'stch-playing': function(target, state) {
    if (app_env.need_favicon){
      if (state){
        target.changeFavicon('playing');
      } else {
        target.changeFavicon('usual');
      }
    }
  },
  changeFavicon: spv.debounce(function(state){
    if (!this.isAlive()){ return; }

    if (state && this.favicon_states[state]){
      this.favicon_node = changeFaviconNode(this.d, this.favicon_node, this.favicon_states[state], 'image/png');
    } else{
      this.favicon_node = changeFaviconNode(this.d, this.favicon_node, this.favicon_states['usual'], 'image/png');
    }
  }, 300),
  favicon_states: {
    playing: 'icons/icon16p.png',
    usual: 'icons/icon16.png'
  }
});

function changeFaviconNode(d, oldLink, src, type) {
  var link = d.createElement('link');
  oldLink = oldLink || d.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  if (type){
    link.type = type;
  }

  link.href = src;
  d.head.replaceChild(link, oldLink);
  return link;
}

var push = Array.prototype.push;

var BrowseLevView = spv.inh(View, {}, {
  children_views_by_mn: {
    pioneer: map_slice_by_model
  },
  base_tree: {
    sample_name: 'browse_lev_con'
  },
  'stch-map_slice_view_sources': function(target, state) {
    if (state) {
      if (target.location_name == 'map_slice-detailed') {
        return;
      }
      if (target.parent_view == target.root_view && target.nesting_name == 'map_slice') {
        var arr = [];
        if (state[0]) {
          arr.push(state[0]);
        }
        push.apply(arr, state[1][target.nesting_space]);
        pvUpdate(target, 'view_sources', arr);
      }

    }
  },
  'collch-$spec_common-pioneer': {
    by_model_name: true,
    place: 'tpl.ancs.con'
  },
  'collch-$spec_det-pioneer': {
    space: 'all-sufficient-details',
    by_model_name: true,
    place: 'tpl.ancs.con'
  },

  'collch-$spec_noplace-pioneer': {
    by_model_name: true
  },
  // 'collch-$spec_wrapped-pioneer': {
  // 	is_wrapper_parent: '^',
  // 	space: 'all-sufficient-details',
  // 	by_model_name: true,
  // 	place: 'tpl.ancs.con'
  // },
  'sel-coll-pioneer//detailed':'$spec_det-pioneer',
  'sel-coll-pioneer/start_page': '$spec_noplace-pioneer',
  // 'sel-coll-pioneer/song': '$spec_wrapped-pioneer',
  'sel-coll-pioneer': '$spec_common-pioneer',

  'compx-mp_show_end': {
    depends_on: ['animation_started', 'animation_completed', 'vmp_show'],
    fn: function(animation_started, animation_completed, vmp_show) {
      if (!animation_started){
        return vmp_show;
      } else {
        if (animation_started == animation_completed){
          return vmp_show;
        } else {
          return false;
        }
      }
    }
  }
});


var BrowseLevNavView = spv.inh(View, {}, {
  base_tree: {
    sample_name: 'brow_lev_nav'
  },
  children_views_by_mn: {
    pioneer: {
      $default: nav.baseNavUI,
      start_page: nav.StartPageNavView,
      // invstg: nav.investgNavUI
    }
  },
  'collch-pioneer': {
    by_model_name: true,
    place: 'c'
  },
  'compx-nav_clickable':{
    depends_on: ['mp_stack', 'mp_has_focus'],
    fn : function(mp_stack, mp_has_focus) {
      return !mp_has_focus && (mp_stack == 'root' || mp_stack == 'top');
    }
  },
  'compx-mp_stack': [
    ['$index', '$index_back', 'vmp_show'],
    function (index, index_back, vmp_show) {
      if (index == 0) {
        return vmp_show && 'root';
      }

      if (index_back == 0) {
        // title
        return;
      }

      if (index_back == 1) {
        return 'top';
      }

      if (index == 1) {
        return 'bottom';
      }

      return 'middle';
    }
  ]
});

var AppView = spv.inh(AppBaseView.WebComplexTreesView, {}, {
  /*children_views_by_mn: {
    navigation: {
      $default: nav.baseNavUI,
      start_page: nav.StartPageNavView,
      invstg: nav.investgNavUI
    }
  },*/
	'probe-loads_search_context_1': View,
  'sel-coll-map_slice/song': '$spec_det-map_slice',
  children_views: {
    map_slice: {
      main: BrowseLevView,
      detailed: BrowseLevView
    },
    navigation: BrowseLevNavView
  },
  controllers: {
    // auth_vk: etc_views.VkLoginUI,
    // auth_lfm: etc_views.LfmLoginView,
    // image_loader: coct.ImageLoader
  },

  state_change: {
    "search_query": function(target, state) {
      target.search_input.val(state || '');
    }
  },

  createDetails: function(){
    this._super();
    var _this = this;

    this.wp_box = new WPBox(this, function() {
      return _this.getNesting('current_mp_md');
    }, function(waypoint) {
      _this.setVisState('current_wpoint', waypoint);
    }, function(cwp) {
      $(cwp.node).click();
      $(cwp.node).trigger('activate_waypoint');

      setTimeout(function() {
        if (_this.state('vis_current_wpoint') != cwp) {
          return;
        }
        var still_in_use = _this.wp_box.isWPAvailable(cwp);
        if (still_in_use){
          _this.scrollToWP(still_in_use);
        } else {
          _this.setVisState('current_wpoint', false);
        }
      },100);
    }, function() {
      return _this.state('vis_current_wpoint');
    }, function(wp) {
      var cur_wp = _this.state('vis_current_wpoint');
      if (cur_wp == wp) {
        _this.setVisState('current_wpoint', false);
      }
    });

    _this.dom_related_props.push('favicon_node', 'wp_box');

		initRootView(this);

    this.on('vip_state_change-current_mp_md', function() {
      var cwp = this.state('vis_current_wpoint');
      if (cwp){
        if (cwp.canUse && !cwp.canUse()){
          _this.setVisState('current_wpoint', false);
        }
      }

    }, {skip_reg: true, immediately: true});

  },
  /*'compx-window_demensions_key': {
    depends_on: ['window_width', 'window_height'],
    fn: function(window_width, window_height) {
      return window_width + '-' + window_height;
    }
  },*/


  buildWidthStreamer: function(target) {
    (function(_this) {
      var app_workplace_width_stream_node = $("#pages_area_width_streamer", _this.d);
      var awwst_win =  app_workplace_width_stream_node[0].contentWindow;

      var style = awwst_win.document.documentElement.style;

      style.padding = 0;
      style.margin = 0;
      style.border = 0;
      style.background = 'transparent';

    // spv.getDefaultView(app_workplace_width_stream_node[0]);
      _this.updateManyStates({
        workarea_width: awwst_win.innerWidth
      });


      var checkWAWidth = spv.debounce(function() {
        //console.log( awwst_win.innerWidth);
        _this.updateManyStates({
          workarea_width: awwst_win.innerWidth
        });
      }, 150);

      spv.addEvent(awwst_win, 'resize', checkWAWidth);

      //$(wd).on('resize', checkWindowSizes);
      _this.onDie(function(){
        spv.removeEvent(awwst_win, 'resize', checkWAWidth);
        awwst_win = null;
        _this = null;
      });


    })(target);
  },
  checkSizeDetector: function() {
    var self = this;
    if (!app_env.check_resize) {
      return;
    }

    var detectSize = function(D){
      if (!D){
        return 0;
      } else {
        return $(D).outerHeight();
      }

      //return Math.max(D.scrollHeight, D.offsetHeight, D.clientHeight);
    };
    var getCurrentNode = function() {
      var current_md = self.getNesting('current_mp_md');
      return current_md && self.getStoredMpx(current_md).getRooConPresentation(this, true, true).getC();
    };

    if (self.rsd_rz){
      clearInterval(self.rsd_rz);
    }

    var oldsize = detectSize(getCurrentNode());
    var offset_top;

    var recheckFunc = function(){
      if (typeof documentScrollSizeChangeHandler == 'function'){
        var newsize = detectSize(getCurrentNode());

        if (oldsize != newsize){
          if (typeof offset_top == 'undefined'){
            var offset = $(getCurrentNode()).offset();
            offset_top = (offset && offset.top) || 0;
          }
          window.documentScrollSizeChangeHandler((oldsize = newsize) + offset_top);
        }

      }
    };

    self.rsd_rz = setInterval(recheckFunc, 100);

    self.on('vip_state_change-current_mp_md', function() {
      recheckFunc();
    }, {
      immediately: true
    });
  },
  calculateScrollingViewport: function(screens_block) {
    var scrolling_viewport;

    if (screens_block.css('overflow') == 'auto') {
      scrolling_viewport = {
        node: screens_block
      };
    } else if (app_env.as_application){
      scrolling_viewport = {
        node: screens_block
      };
    } else {
      if (app_env.lg_smarttv_app){
        scrolling_viewport = {
          node: screens_block
        };
      } else {
        scrolling_viewport = {
          node: $( this.d.body ),
          offset: true
        };
      }
    }
    return scrolling_viewport;
  },
  tpl_events: {

  },
  selectKeyNodes: function() {
    var slider = this.d.getElementById('slider');
    var screens_block = $( '#screens', this.d );
    var app_map_con = screens_block.children('.app_map_con');
    var scrolling_viewport = this.calculateScrollingViewport(screens_block);

    var start_screen = $( '#start-screen', this.d );


    spv.cloneObj(this.els, {
      screens: screens_block,
      app_map_con: app_map_con,
      scrolling_viewport: scrolling_viewport,
      slider: slider,
      navs: $(slider).children('.navs'),
      start_screen: start_screen,
      pestf_preview: start_screen.children('.personal-stuff-preview')
    });

  },
  buildAppDOM: spv.precall(AppBaseView.WebComplexTreesView.prototype.buildAppDOM, function() {
    var _this = this;
    var d = this.d;

      console.log('dom ready');

      _this.checkSizeDetector();
      _this.nextTick(_this.buildWidthStreamer);

      _this.wrapStartScreen(this.els.start_screen);

      if (app_env.bro.browser.opera && ((typeof window.opera.version == 'function') && (parseFloat(window.opera.version()) <= 10.1))){

        $('<a id="close-widget">&times;</a>',d)
          .click(function(){
            window.close();
          })
          .prependTo(_this.els.slider);
      }

      var d_click_callback = function(e) {
        e.preventDefault();
        app_env.openURL($(this).attr('href'));
        _this.trackEvent('Links', 'just link');
      };

      $(d).on('click', '.external', d_click_callback);
      _this.onDie(function() {
        $(d).off('click', d_click_callback);
      });



      var kd_callback = function(e){
        if (d.activeElement && d.activeElement.nodeName == 'BUTTON'){return;}
        if (d.activeElement && d.activeElement.nodeName == 'INPUT'){
          if (e.keyCode == 27) {
            d.activeElement.blur();
            e.preventDefault();
            return;
          }
        }

        arrowsKeysNav(_this, e);
      };

      $(d).on('keydown', kd_callback);

      _this.onDie(function() {
        $(d).off('keydown', kd_callback);
      });


      _this.onDie(function() {
        _this = null;
        d = null;
      });
  }),
  scrollToWP: function(cwp) {
    if (cwp){
      var cur_md_md = this.getNesting('current_mp_md');
      var parent_md = cur_md_md.getParentMapModel();
      if (parent_md && cwp.view.getAncestorByRooViCon('main') == this.getStoredMpx(parent_md).getRooConPresentation(this)){
        this.scrollTo($(cwp.node), {
          node: this.getLevByNum(parent_md.map_level_num).scroll_con
        }, {vp_limit: 0.6, animate: 117});
      }
      this.scrollTo($(cwp.node), false, {vp_limit: 0.6, animate: 117});
    }
  },
  'stch-vis_current_wpoint': function(target, nst, ost) {
    if (ost){
      $(ost.node).removeClass('surf_nav');
    }
    if (nst) {
      $(nst.node).addClass('surf_nav');
      target.scrollToWP(nst);
    }
  },

  trackEvent: function() {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift('trackEvent');
    this.RPCLegacy.apply(this, args);
  },
});

AppView.AppExposedView = AppExposedView;
return AppView;
});
