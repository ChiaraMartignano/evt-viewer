/**
 * @ngdoc service
 * @module evtviewer.namedEntitiesSearch
 * @name evtviewer.namedEntitiesSearch.evtNamedEntitiesSearch
 * @description
 * # evtNamedEntitiesSearch
 * This provider expands the scope of the
 * {@link evtviewer.namedEntitiesSearch.directive:evtNamedEntitiesSearch evtNamedEntitiesSearch} directive
 * and stores its reference untill the directive remains instantiated.
 * It also add some modules to controller, according to <code>&lt;evt-tabs-container&gt;</code> type.
 *
 * @requires $log
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.namedEntitiesSearch')

.provider('evtNamedEntitiesSearch', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, parsedData, evtInterface) {
		var namedEntitiesSearch = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('namedEntitiesSearch');

		namedEntitiesSearch.build = function(scope) {
			var currentId 	= scope.id || idx++,
				currentType = scope.type || '',
				orientation = scope.orientation || 'vertical';

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			scopeHelper = {};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId,
				type: currentType
			});

			return collection[currentId];
		};

		return namedEntitiesSearch;
	};

});
