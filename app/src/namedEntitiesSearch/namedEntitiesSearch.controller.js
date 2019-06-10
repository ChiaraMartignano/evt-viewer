/**
 * @ngdoc object
 * @module evtviewer.namedEntitiesSearch
 * @name evtviewer.namedEntitiesSearch.controller:namedEntitiesSearchCtrl
 * @description
 * # namedEntitiesSearchCtrl
 * This is the controller for the {@link evtviewer.namedEntitiesSearch.directive:evtNamedEntitiesSearch evtNamedEntitiesSearch} directive.
 * @requires $log
 * @requires $scope
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.namedEntitiesSearch')

.controller('namedEntitiesSearchCtrl', function($log, $scope, evtNEOccurrencesSearchResults, evtNamedEntitiesSearch) {

    var _console = $log.getInstance('namedEntitiesSearch');

    $scope.search = function() {
        var results = evtNEOccurrencesSearchResults.getSearchResults($scope.vm.inputValue, $scope.vm.field);
        $scope.vm.results = results;
    }

    $scope.destroy = function() {
		evtNamedEntitiesSearch.destroy($scope.vm.id);
	};
});