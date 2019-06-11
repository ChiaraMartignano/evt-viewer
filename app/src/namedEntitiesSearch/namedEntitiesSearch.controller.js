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

.controller('namedEntitiesSearchCtrl', function($log, $scope, evtNEOccurrencesSearchResults, evtNamedEntitiesSearch, evtInterface, parsedData, evtList, evtTabsContainer, config) {

    var _console = $log.getInstance('namedEntitiesSearch');

    $scope.search = function() {
        var results = evtNEOccurrencesSearchResults.getSearchResults($scope.vm.inputValue, $scope.vm.field);
        $scope.vm.results = results;
        $scope.vm.resultsAvailable = checkLangs(results);
    }

    $scope.openNamedEntity = function(entityId) {
        console.log(entityId)
        var list = parsedData.getNamedEntities()[entityId].collectionId;
        evtTabsContainer.setSubTabOpened('toc', 'entitiesLists', list);
        evtInterface.updateState('currentNamedEntity', entityId);
        setTimeout(function() {
            evtList.scrollToElemById(list, entityId);
        }, 1000);
    }

    var changeView = function() {
        if (evtInterface.getState('currentViewMode') !== 'collation') {
            evtInterface.updateState('currentViewMode', 'collation');
        }
    }

    var updateWits = function(doc) {
        var wit, corresp = parsedData.getWitnessesList().find(function(witId) {
            wit = witId
            return parsedData.getWitness(witId).corresp === doc;
        });
        if (config.mainDocId && corresp) {
            var currentWits = evtInterface.getState('currentWits');
            var index = currentWits.indexOf(wit);
            if (index === -1) {
                evtInterface.addWitnessAtIndex(wit, 0);
            } else if (index > 0) {
                evtInterface.switchWitnesses(currentWits[0], wit);
            }
        }
    }

    $scope.goToDiv = function(doc, div) {
        if (config.mainDocId && config.mainDocId !== doc) {
            changeView();
            updateWits(doc);
        }
        if (div) evtInterface.updateDiv(doc, div);
        evtInterface.updateState('secondaryContent', '');
        evtInterface.updateUrl();
    }

    $scope.selectLang = function() {
        $scope.vm.resultsAvailable = $scope.vm.results.length > 0 ? checkLangs($scope.vm.results) : true;
    }

    $scope.selectAllLangs = function($event) {
        for (var i = 0; i < $scope.vm.langs._indexes.length; i++) {
            $scope.vm.langs[$scope.vm.langs._indexes[i]] = $event.target.checked;
        }
        $scope.vm.resultsAvailable = $scope.vm.results.length > 0 ? checkLangs($scope.vm.results) : true;
    }

    var checkLangs = function(results) {
        console.log(results)
        var resultsAvailable = false
        for (var i = 0; i < results.length; i++) {
            var availableLangs = [];
            for (var j = 0; j < results[i]._langs.length; j++) {
                if ($scope.vm.langs[results[i]._langs[j]]) {
                    availableLangs.push(results[i]._langs[j])
                }
            }
            resultsAvailable = resultsAvailable || availableLangs.length > 0;
        }
        return resultsAvailable;
    }

    $scope.checkLangs = function(results) {
        return checkLangs(results)
    }

    $scope.destroy = function() {
		evtNamedEntitiesSearch.destroy($scope.vm.id);
    };
});