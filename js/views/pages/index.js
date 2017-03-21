define(function (require) {
'use strict';
var StartPageView = require('./StartPageView');
// var SearchPageView = require('./SearchPageView');

return {
	// $default: coct.ListOfListsView,
	start_page : StartPageView,
	// invstg: SearchPageView,
	// playlist: {
	// 	'main': SongsListView,
	// 	'all-sufficient-details': SongsListView.SongsListDetailedView,
	// },
};
})
