define(function(require) {
'use strict';
var spv = require('spv');
var $ = require('jquery');

var serv = {};

(function() {
	var css = {};

	var dom_style_obj = window.document.body.style;
	var has_transform_prop;
	var has_transition_prop;

	var transition_props = {
		//https://github.com/ai/transition-events/blob/master/lib/transition-events.js
		// Webkit must be on bottom, because Opera try to use webkit
		// prefix.
		'transition':		'transitionend',
		'OTransition':		'oTransitionEnd',
		'WebkitTransition':	'webkitTransitionEnd',
		'MozTransition':	'transitionend'
	};

	for ( var prop in transition_props ) {
		if (prop in dom_style_obj){
			has_transition_prop = transition_props[prop];
			break;
		}
	}

	['transform', '-o-transform', '-webkit-transform', '-moz-transform'].forEach(function(el) {
		if (!has_transform_prop && el in dom_style_obj){
			has_transform_prop = el;
		}
	});

	if (has_transition_prop){
		css.transition = has_transition_prop;
	}

	if (has_transform_prop){
		css.transform = has_transform_prop;
	}

	serv.css = css;

})();

var loadImage = (function() {
	var loaded_images = {};
	var images_callbacks = {};
	var addImageLoadCallback = function(url, cb) {
		if (!images_callbacks[url]){
			images_callbacks[url] = [];
		}
		images_callbacks[url].push(cb);
	};
	var removeImageLoadCallback = function(url, cb) {
		if (images_callbacks[url]){
			images_callbacks[url] = spv.arrayExclude(images_callbacks[url], cb);
		}
	};

	var triggerImagesCallback = function(url) {
		var array = images_callbacks[url];
		if (array){
			while (array.length){
				var cb = array.shift();
				cb.call();
			}
		}
	};

	return function(opts) {
		if (typeof opts.cache_allowed != 'boolean'){
			throw new Error('cache_allowed must be true or false');
		}
		//queue

		var done, accomplished, url = opts.url;
		var node = opts.node || new window.Image();
		var deferred = $.Deferred();

		var async_obj = deferred.promise({
			abort: function() {
				if (node){
					node.src = '';
				}

				if (this.queued){
					this.queued.abort();
				}
				unbindEvents();

				node = null;
				opts = null;
			}
		});
		var imageLoadCallback = function(){
			accomplishLoad();
		};

		function unbindEvents() {
			if (node) {
				spv.removeEvent(node, "load", loadCb);
				spv.removeEvent(node, "error", errorCb);
			}

			removeImageLoadCallback(url, imageLoadCallback);
		};

		function loadCb(e) {
			if (done){
				return;
			}
			done = true;
			deferred.resolve(node);
			unbindEvents();
			if (async_obj && async_obj.queued){
				async_obj.queued.abort();
			}
			if (async_obj.timeout_num){
				clearTimeout(async_obj.timeout_num);
			}
			if (e && e.type == 'load'){
				triggerImagesCallback(opts.url);
			}

			node = null;
			opts = null;
		};
		function errorCb() {
			deferred.reject(node);
			unbindEvents();

			node = null;
			opts = null;
		};

		spv.addEvent(node, "load", loadCb);
		spv.addEvent(node, "error", errorCb);


		function accomplishLoad() {
			if (accomplished){
				return;
			}
			accomplished = true;

			node.src = opts.url;
			if (node.complete){
				if (opts.cache_allowed){
					loaded_images[opts.url] = true;
				}
				loadCb();
			} else {
				if (opts.timeout){
					async_obj.timeout_num = setTimeout(function() {
						deferred.reject(node, 'timeout');
						unbindEvents();

						node = null;
						opts = null;

					}, opts.timeout);
				}
			}
		};
		if (opts.queue && !loaded_images[opts.url]){
			addImageLoadCallback(opts.url, imageLoadCallback);
			async_obj.queued = opts.queue.add(accomplishLoad);

		} else {
			accomplishLoad();
		}
		return async_obj;
	};
})();

serv.loadImage = loadImage;

return serv;
});
