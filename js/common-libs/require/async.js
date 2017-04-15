/** @license
 * RequireJS plugin for async dependency load like JSONP and Google Maps
 * Author: Miller Medeiros
 * Version: 0.1.2 (2014/02/24)
 * Released under the MIT license
 */
define(function(){
'use strict';
var DEFAULT_PARAM_NAME = 'callback',
    _uid = 0;

function injectScript(src){
    var s, t;
    s = window.document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = src;
    t = window.document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s,t);
}

function formatUrl(name, id){
    var paramRegex = /!(.+)/,
        url = name.replace(paramRegex, ''),
        param = (paramRegex.test(name))? name.replace(/.+!/, '') : DEFAULT_PARAM_NAME;
    url += (url.indexOf('?') < 0)? '?' : '&';
    return url + param +'='+ id;
}

function uid() {
    _uid += 1;
    return '__async_req_'+ _uid +'__';
}

return{
    load : function(name, req, onLoad, config){
        if (config.isBuild){
            onLoad(null); //avoid errors on the optimizer
        } else{
            var id = uid();
            //create a global variable that stores onLoad so callback
            //function can define new module after async load
            window[id] = function () {
              delete window[id];
              onLoad.apply(this, arguments);
            };
            injectScript(formatUrl(req.toUrl(name), id));
        }
    }
};
});