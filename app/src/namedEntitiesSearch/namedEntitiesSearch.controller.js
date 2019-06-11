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
    }

    $scope.openNamedEntity = function(entityId) {
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

    $scope.selectLang = function(lang) {
        $scope.vm.langs[lang] = !$scope.vm.langs[lang];
    }

    $scope.selectAllLangs = function($event) {
        for (var i = 0; i < $scope.vm.langs._indexes.length; i++) {
            $scope.vm.langs[$scope.vm.langs._indexes[i]] = $event.target.checked;
        }
    }

    $scope.destroy = function() {
		evtNamedEntitiesSearch.destroy($scope.vm.id);
    };
});