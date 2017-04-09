define(function(require) {
'use strict';
var pv = require('pv');

var LoadableListBase = require('./LoadableListBase');

var SearchPage = pv.behavior({
  'compx-search_query': [[], function () {
    return true;
  }],
  main_list_name: 'loads_list',
  model_name: 'loads_search_page',
  'nest_rqc-loads_list': '^loads/[:id]',
  'nest_req-loads_list': [
    [{
      is_array: true,
      source: 'items',
      props_map: {
        id: 'id',
        broker: null,
        age: null,
        equipment: null,
        pickup: null,
        price: null,
        weight: null,
        width: null,
        drop_off: null,
        load_size: null,
        length: null,
      }
    }],
    ['#truckloads', [
      ['search_query'],
      function(api, opts, search_query) {
        return api.post('/shipments/search', {
            "query": {
                "pickup": {
                    "date_local": {
                        "from": "2017-04-09T00:00:00",
                        "to": "2017-04-22T23:59:59"
                    }
                },
                "load_size": "full"
            },
            "options": {
                "featured_first": false
            },
            "sort": [{
                "age": "asc"
            }],
            "limit": 200,
            "offset": 0
        }, opts);
      }
    ]]
  ]
}, LoadableListBase);

return SearchPage;
});


/*
POST /shipments/search
    -h "installation-id:..."
    -h "client:..."
    -h "x-auth-token:..."
    -d
{
  "query": {
    "pickup": {
      "date_local": {
        "from": "2016-05-04T00:00:00",
        "to": "2016-05-04T23:59:59"
      }
      "states": ["CA", "NV"],
      "geo": {
        "location": {
          "lat": 10.000,
          "lng": 12.000
        },
        "deadhead": {
          "max": 100
        }
      }
    },
    "drop_off": {
      "states": ["CA", "NV"],
      "geo": {
        "location": {
          "lat": 10.000,
          "lng": 12.000
        },
        "deadhead": {
          "max": 100
        }
      }
    },
    "equipment": ["van", "flatbed"],
    "load_size": "full",
    "weight": {
      "min": 2000,
      "max": 10000
    },
    "distance": {
      "min": 10,
      "max": 1000
    }
  },
  "options": {
    "include_auth_required": false,
    "new_first": true,
    "featured_first": true,
    "repeat_search": false,
    "mark_new_since": "2017-01-01T00:00:00Z"
  }
  "sort": [
    {"dho": "desc"},
    {"distance": "asc"},
    {"age": "asc"},
    {"pickup_date": "asc"},
    {"weight": "asc"},
    {"equipment": "asc"},
    {"id": "desc"}
  ],
  "limit": 100,
  "offset": 0
}
*/
