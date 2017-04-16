define(function(require) {
"use strict";

var spv = require('spv');

var SyncSender = function() {
	this.sockets = {};
	this.streams_list = [];
	this.sockets_m_index ={};
};

SyncSender.prototype = {
	removeSyncStream: function(stream) {
		if (!this.sockets[stream.id]) {
			return;
		}
		this.sockets_m_index[stream.id] = null;
		this.sockets[stream.id] = null;
		this.streams_list = spv.findAndRemoveItem(this.streams_list, stream);
	},
	addSyncStream: function(start_md, stream) {
		this.sockets_m_index[stream.id] = {};
		this.sockets[stream.id] = stream;
		this.streams_list.push(stream);

		var struc = start_md.toSimpleStructure(this.sockets_m_index[stream.id]);
		stream.buildTree(struc);

	},
	pushNesting: function(md, nesname, value){
		//var struc;
		var parsed_value;
		for (var i = 0; i < this.streams_list.length; i++) {
			var cur = this.streams_list[i];
			var index = this.sockets_m_index[cur.id];
			if (index[md._provoda_id]){


				if (value && typeof parsed_value == 'undefined') {
					//parsed_value

					if (value._provoda_id){
						parsed_value = value._provoda_id;
					} else if (Array.isArray(value)){

						parsed_value = new Array(value.length);
						for (var jj = 0; jj < value.length; jj++) {
							parsed_value[jj] = value[jj]._provoda_id;
						}
					} else {
						console.warn('unparsed', value);
					}
					if (parsed_value == 'undefined') {
						parsed_value = null;
					}
				}

				var struc = md.toSimpleStructure(index);
				cur.changeCollection(md._provoda_id, struc, nesname, parsed_value);
			}
		}
	},
	pushStates: function(md, states) {
	//	var struc;
		var needs_changes, parsing_done, fixed_values;

		for (var i = 0; i < this.streams_list.length; i++) {
			var cur = this.streams_list[i];
			if (this.sockets_m_index[cur.id][md._provoda_id]) {
				if (!parsing_done) {
					for ( var jj = 2; jj < states.length; jj += 3 ) {
						var cur_value = states[jj];
						if (cur_value && typeof cur_value == 'object' && cur_value._provoda_id) {
							needs_changes = true;

							if (!fixed_values) {
								fixed_values = states.slice();
							}

							fixed_values[jj] = {
								_provoda_id: states[jj]._provoda_id
							};
							//fixme, отправляя _provoda_id мы не отправляем модели
							//которые могли попасть в состояния после отправки ПОДДЕЛКИ текущей модели

						}
						//needs_changes
					}
				}
				cur.updateStates(md._provoda_id, needs_changes ? fixed_values : states);
			}
		}
	}
};
return SyncSender;
});
