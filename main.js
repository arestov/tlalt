(function(){
"use strict";
requirejs.config({
	paths: {
		jquery: 'js/common-libs/jquery-2.1.4.min',
		angbo: 'js/libs/provoda/StatementsAngularParser.min',
	},
	map: {
		'*': {
			pv: 'js/libs/provoda/provoda',
			View: 'js/libs/provoda/View',

			spv: 'js/libs/spv',
			app_serv: "js/app_serv",
			localizer: 'js/libs/localizer',
			view_serv: "js/views/modules/view_serv",
			cache_ajax: 'js/libs/cache_ajax',
			env: "js/env",

			hex_md5: 'js/common-libs/md5',
			'Promise': 'js/common-libs/Promise-3.1.0.mod'
		}
	},
	waitSeconds: window.tizen && 0
});

var version = 0.1;
window._gaq = window._gaq || [];

(function() {
	requirejs(['js/App', 'pv', 'env'], function(App, pv, env) {
		//app thread;
		var views_proxies = new pv.views_proxies.Proxies();
		window.views_proxies = views_proxies;
		window.appModel = new App({
			_highway: {
				models_counters: 1,
				sync_sender: new pv.SyncSender(),
				views_proxies: views_proxies,
				models: {},
				calls_flow: new pv.CallbacksFlow(window),
				proxies: views_proxies,
				env: env,
			}
		}, version);

		initViews(window.appModel, views_proxies, window, false);
	});

	function initViews(appModel, proxies, win, can_die) {
		//ui thread;
		requirejs(['js/views/AppView', 'pv', 'spv', 'js/libs/BrowseMap'], function(AppView, pv, spv, BrowseMap) {

			var proxies_space = Date.now();
			proxies.addSpaceById(proxies_space, appModel);
			var mpx = proxies.getMPX(proxies_space, appModel);
			var doc = win.document;

			initMainView();

			function initMainView() {
				window.root_bwlev = BrowseMap.hookRoot(mpx.md);
				var view = new AppView(options(), {d: doc, can_die: can_die, bwlev: window.root_bwlev});
				mpx.addView(view, 'root');
				view.onDie(function() {
					//views_proxies.removeSpaceById(proxies_space);
					view = null;
				});
				view.requestAll();
			}

			function options(usual_flow) {
				return {
					mpx: mpx,
					proxies_space: proxies_space,
					_highway: {
						views_counter: 1,
						views_proxies: proxies,
						calls_flow: new pv.CallbacksFlow(win),
						local_calls_flow: new pv.CallbacksFlow(spv.getDefaultView(doc), !usual_flow, 250)
					}
				};
			}
		});
	}

})();



})();