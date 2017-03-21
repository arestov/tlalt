define(function () {
'use strict';
var detectBrowser = (function(w) {
	var
		rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
		ua = w && w.window.navigator && w.window.navigator.userAgent;

	return function detectBrowser() {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	};

})(window);

var env = (function(wd){
	var xhr2_support = window.window.XMLHttpRequest && "withCredentials" in (new window.XMLHttpRequest());  //https://gist.github.com/1431660

	var bro = detectBrowser();

	var env = {
		bro: bro,
	};

	env.cross_domain_allowed = !wd.location.protocol.match(/(http\:)|(file\:)/);

	env.xhr2 = !!xhr2_support;

	if (typeof process == 'object' && window.process.nextTick && typeof window.navigator == 'object'){
		env.app_type = 'nodewebkit';
		env.as_application = false;
		env.deep_sanbdox = true;
		env.needs_url_history = true;
		env.torrents_support = true;
		env.cross_domain_allowed = true;

	} else if (window.tizen){
		env.app_type = 'tizen_app';
		env.as_application = false;
		env.deep_sanbdox = true;
		env.needs_url_history = true;

	} else if (typeof widget == 'object' && !window.widget.fake_widget){
		if (bro.browser == 'opera'){
			if (window.opera.extension){
				env.app_type = 'opera_extension';
			} else{
				env.app_type = 'opera_widget';
				env.deep_sanbdox = true;
			}

		} else {
			env.app_type = 'apple_db_widget';
		}
		env.deep_sanbdox = true;
		env.as_application = true;

	} else if (typeof chrome === 'object' && wd.location.protocol == 'chrome-extension:'){

		var opera = window.navigator.userAgent.indexOf('OPR') != -1;
		if (wd.location.pathname == '/index.html'){
			env.app_type = opera ? 'opera_app' : 'chrome_app';
			env.as_application = false;
			env.needs_url_history = true;
			env.need_favicon = true;
		} else{
			env.chrome_like_ext = true;
			env.app_type = opera ? 'opera_extension' : 'chrome_extension';
			env.as_application = true;
		}

	} else if (wd.location.protocol.match(/http/)){

		env.need_favicon = true;
		env.app_type = 'web_app';

		env.as_application = false;
		env.needs_url_history = true;

	} else if (wd.pokki && wd.pokki.show){
		env.safe_data = true;
		env.app_type = 'pokki_app';
		env.cross_domain_allowed = true;
		env.deep_sanbdox = true;
		//env.as_application = true;
	} else if (typeof btapp == 'object'){
		env.app_type = 'utorrent_app';
		env.as_application = false;
		env.deep_sanbdox = true;

	} else if (bro.browser == 'mozilla'){
		env.app_type = 'firefox_widget';
		env.as_application = true;

	} else{
		env.app_type = false;
		env.unknown_app = true;
		env.needs_url_history = true;
	}

	try {
		if (wd.document.createEvent('TouchEvent')){
			env.touch_support = true;
		}
	} catch(e){}



	//env.needs_url_history = false; //TEMP

	if (!env.app_type){
		env.app_type = 'unknown_app_type' + (wd.window.navigator.userAgent && ': ' + wd.window.navigator.userAgent);
		env.unknown_app_type = true;
		env.deep_sanbdox = true;
	} else{
		env[env.app_type] = true;
	}


	env.iframe_support = !env.utorrent_app && (!env.unknown_app_type || wd.location.protocol == 'file:');

	var getLang = function() {
		return (wd.window.navigator.language || wd.window.navigator.browserLanguage || 'en').slice(0,2).toLowerCase();
	};

	env.lang = getLang();

	return env;
})(window);

return env;
});
