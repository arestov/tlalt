define(function(require) {
"use strict";
var dateFns = require('js/common-libs/date_fns.1.9.0.min.js');

var humanToId = {
  'Flatbed': 'F',
  'Van': 'V',
  'Reefer': 'R',
  'Stepdeck': 'SD',
  'Power only': 'PO',
  'Auto Carrier': 'AC',
  'B-Train': 'BT',
  'Conestoga': 'N',
  'Containers': 'C',
  'Double Drop': 'DD',
  'Dry Bulk': 'B',
  'Dump Trailer': 'DT',
  'Hopper Bottom': 'HB',
  'Lowboy': 'LB',
  'Tanker': 'T',
};

var humanToIdLC = {};
for (var name in humanToId) {
  humanToIdLC[name.toLowerCase()] = humanToId[name];
}

var filters = {
	limitTo: function(input, limit) {
		if (Array.isArray(input)){
			return input.slice(0, limit);
		} else if ( typeof input == 'string' ) {
			if (limit) {
				return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
			} else {
				return "";
			}
		} else {
			return input;
		}
	},
  formatDate: function(date, format) {
		return dateFns.format(date, format);
  },
	notGIF: function(input) {
		if (input.lastIndexOf('.gif') == input.length - 4){
			return;
		} else {
			return input;
		}
	},
  shortEquipment: function (input) {
    if (Array.isArray(input)) {
      return input.map(shortEquipment).join(' ');
    }

    return shortEquipment(input);
  },
  kilo: function (input) {
    if (!input) {return input;}
    return Math.round(input/1000) + "k";
  },
  formatDuration: formatTimeDuration,
};

function formatTimeDuration(milliseconds) {
  var diffInMins = milliseconds / 1000 / 60;

  if (diffInMins < 1) {
    return '1m';
  }

  var hours = Math.trunc(diffInMins / 60);
  var mins = Math.trunc(diffInMins % 60);
  var days = Math.trunc(hours / 24);

  var minsMsg = (mins === 1) ? '1m' : (mins + 'm');
  var hoursMsg = (hours === 1) ? '1h' : (hours + 'h');
  var daysMsg = days + 'd';

  if (days >= 1) {
    return daysMsg;
  }

  if (hours > 0) {
    return hoursMsg;
  }

  if (hours === 0 && mins >= 1) {
    return minsMsg;
  }

  return null;
}

function gradeAge(milliseconds) {
  var diffInHours = milliseconds / 1000 / 60 / 60;
  if (diffInHours > 24) {
    return 'old';
  }

  if (diffInHours > 1) {
    return 'ok';
  }

  return 'fresh';
}

function shortEquipment(item) {
  return humanToIdLC[item];
}

return filters;
});
