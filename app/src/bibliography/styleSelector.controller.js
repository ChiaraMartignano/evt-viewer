angular.module('evtviewer.dataHandler')

.controller('StyleSelectorCTRL', function($scope,config,$timeout) {
	$scope.notify = function(selectedStyle){
		$scope.$emit('styleChangedEmit', {message: selectedStyle});
	}
	$scope.styles = config.allowedBibliographicStyles;
	//all'inizio diamo un pochetto di tempo per istanziare gli altri controller riceventi della direttiva evt-bibl-ref
	
	$scope.selectedStyle = $scope.styles[0];	
	$scope.notify($scope.selectedStyle);},0);
