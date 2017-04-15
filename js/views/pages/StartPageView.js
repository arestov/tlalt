define(function(require) {
'use strict';
var spv = require('spv');
var SPView= require('./SPView');


var StartPageView = spv.inh(SPView, {}, {
  createDetails: function(){

    this.els = this.root_view.els;
    this.c = this.els.start_screen;
    this.createTemplate();


    this.addWayPoint(this.tpl.ancs['hint-query'], {
      //simple_check: true
    });


    var _this = this;
    var checkFocus = function(state) {
      if (state){
        _this.nextLocalTick(_this.tickCheckFocus);
      }
    };
    this.on('state_change-autofocus', function(e) {
      checkFocus(e.value);
    }, {immediately: true});
  },

  tickCheckFocus: function() {
    if (this.isAlive()){
      // this.root_view.search_input[0].focus();
      // this.root_view.search_input[0].select();
    }
  },
  // 'collch-muco': true,
  // 'collch-pstuff': true,
  // 'collch-tags': true,
  children_views: {
    // pstuff: {
    // 	main: UserCardPreview
    // },
    // tags: coct.ListPreview
  },
  'compx-autofocus': {
    depends_on: ['mp_show_end', 'mp_has_focus'],
    fn: function(shw_end, focus) {
      return focus && shw_end;
    }
  },
});
return StartPageView;
});
