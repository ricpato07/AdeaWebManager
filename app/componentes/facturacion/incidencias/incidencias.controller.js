(function() {
	'use strict';

	angular.module('adeaModule').controller('IncidenciasController',
			IncidenciasController);

	IncidenciasController.$inject = [ '$log', '$timeout', 'AdeaServicios',
			'$window' ];

	function IncidenciasController($log, $timeout, AdeaServicios, $window) {

		var incidenciasCtrl = this;

	}
})();