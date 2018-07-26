(function() {
	'use strict';

	angular.module('adeaModule').controller('VisorController', VisorController);

	VisorController.$inject = [ '$log', 'tblSubProyectos', 'proyectoServicios',
			'AdeaServicios', 'tblActividadesPlan', '$filter', '$timeout',
			'DTColumnDefBuilder', 'tblReprogramacion', '$location', '$http', '$scope' ];

	function VisorController($log, tblSubProyectos, proyectoServicios,
			AdeaServicios, tblActividadesPlan, $filter, $timeout,
			DTColumnDefBuilder, tblReprogramacion, $location, $http, $scope) {

		var visorCtrl = this;
		
		$scope.pdfUrl = 'app/componentes/Visor/206469945.PDF';
		
		visorCtrl.url = 'app/componentes/Visor/example.pdf';

		visorCtrl.pdf = {
	        src: visorCtrl.url,  // get pdf source from a URL that points to a pdf
	        data: null // get pdf source from raw data of a pdf
	    };

		getPdfAsArrayBuffer(visorCtrl.url).then(function(response) {
			visorCtrl.pdf.data = new Uint8Array(response.data);
		}, function(err) {
			console.log('Error al cargar el archivo binario:', err);
		});

		function getPdfAsArrayBuffer(url) {
			return $http.get(url, {
				responseType : 'arraybuffer'
			});
		}
	}
})();