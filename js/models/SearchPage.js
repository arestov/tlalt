define(function(require) {
'use strict';
var pv = require('pv');

var BrowseMap = require('js/libs/BrowseMap');

var SearchPage = pv.behavior({
  model_name: 'loads_search_page',
  'nest_req-loads_list': [
		[{
			is_array: true,
			source: 'similartags.tag',
			props_map: {
				count: null,
				name: null
			}
		}],
    ['truckloads', [
      ['search_query'],
      function(api, opts, search_query) {
    		return api.get('/shipments/search', search_query, opts);
      }
    ]]
	]
}, BrowseMap.Model);

return SearchPage;
});
