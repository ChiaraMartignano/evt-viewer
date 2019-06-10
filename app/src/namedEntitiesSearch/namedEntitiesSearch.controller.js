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

.controller('namedEntitiesSearchCtrl', function($log, $scope, evtNEOccurrencesSearchResults, evtNamedEntitiesSearch, evtInterface, parsedData, evtList, evtTabsContainer) {

    var _console = $log.getInstance('namedEntitiesSearch');

    $scope.search = function() {
        var results = evtNEOccurrencesSearchResults.getSearchResults($scope.vm.inputValue, $scope.vm.field);
        $scope.vm.results = results;
    }

    $scope.openNamedEntity = function(entityId) {
        var list = parsedData.getNamedEntities()[entityId].collectionId;
        evtTabsContainer.setSubTabOpened('toc', 'entitiesLists', list);
        evtInterface.updateState('currentNamedEntity', entityId);
        setTimeout(function() {
            evtList.scrollToElemById(list, entityId);
        }, 1000);
    }

    $scope.openDiv = function(divId) {
        console.log(divId)
    }

    $scope.destroy = function() {
		evtNamedEntitiesSearch.destroy($scope.vm.id);
    };
});