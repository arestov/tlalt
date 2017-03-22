define(function (require) {
'use strict';
var StartPageView = require('./StartPageView');
var SearchPageView = require('./SearchPageView');
var LoadItemView = require('./LoadItemView');
// var SearchPageView = require('./SearchPageView');

return {
  // $default: coct.ListOfListsView,
  start_page : StartPageView,
  loads_search_page: SearchPageView,
  load_item: LoadItemView,
  // invstg: SearchPageView,
  // playlist: {
  // 	'main': SongsListView,
  // 	'all-sufficient-details': SongsListView.SongsListDetailedView,
  // },
};
})
