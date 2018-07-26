(function () {

    /**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que contiene la funcionalidad para el proceso de
	 *              Facturación estandar.
	 */
    angular
        .module('adeaDirectivas')
        .controller('FacturacionEstandar', FacturacionEstandar)
        .directive('facEstandar', facEstandar);

    FacturacionEstandar.$inject = ['$log', '$scope', 'AdeaServicios', '$filter', '$compile', 'FacturacionServicios', '$window', 'ProformaServicios'];

    function FacturacionEstandar($log, $scope, AdeaServicios, $filter, $compile, FacturacionServicios, $window, ProformaServicios) {

        var facturacionEstandarCtrl = this;
        
        facturacionEstandarCtrl.carteraSeleccionada = $scope.carteraSeleccionada;
        facturacionEstandarCtrl.procesaFacturacionGral = procesaFacturacionGral;
        facturacionEstandarCtrl.downloadArchivoFact = downloadArchivoFact;
        facturacionEstandarCtrl.confirmarLayouts = confirmarLayouts;
        facturacionEstandarCtrl.bndProforma = false;
        
        consultaPeriodo();
        
        function consultaPeriodo(){
        	$log.info('consultaPeriodo');
        	
            var promesa = FacturacionServicios.consultaPeriodoActual().$promise;

            promesa.then(function (respuesta) {
            	facturacionEstandarCtrl.periodoActual = respuesta;
            	
            	facturacionEstandarCtrl.periodoFac = $filter('fechaSFecha')(facturacionEstandarCtrl.periodoActual.fechaIni) +  ' al ' + $filter('fechaSFecha')(facturacionEstandarCtrl.periodoActual.fechaFin); 
            	
            	if(facturacionEstandarCtrl.periodoActual.fechaIni == null || facturacionEstandarCtrl.periodoActual.fechaIni == undefined){
            		facturacionEstandarCtrl.bndFacEValida = 'F';
        		}else{
                	
        			if(facturacionEstandarCtrl.carteraSeleccionada.idProceso != null && facturacionEstandarCtrl.carteraSeleccionada.idProceso != undefined){
        			
	            		var params = {
	            				idCartera: facturacionEstandarCtrl.carteraSeleccionada.idCarteraCliente,
	            		}
	                        	
	            		var promesa = FacturacionServicios.consultaFacturacionGralExis(params).$promise;
	
	            		promesa.then(function (respuesta) {
	            			facturacionEstandarCtrl.periodo = respuesta;
	            			facturacionEstandarCtrl.bndFacEValida = 'V';
	            			
	            			if(respuesta != null && respuesta.estatus == 'P'){
	            				facturacionEstandarCtrl.bndFacEValida = 'L';
	            			}else if(respuesta != null && respuesta.estatus == 'E'){
	            				facturacionEstandarCtrl.erroresFacGral = respuesta.mensajeErr;
	            		  	}else if(facturacionEstandarCtrl.periodo.bndLayout == 'S'){
	            				consultaCatalogos();
	            			}
	            		});
            		
        			}else{
        				AdeaServicios.alerta("error", "La Cartera Seleccionada No tiene un Proceso configurado para Ejecutar, solicitar se configure un proceso.");
        			}
        		}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar el periodo Actual");
            });
        	
        }
        
        function procesaFacturacionGral(){
        	$log.info('procesaFacturacionGral');
        	
        	if(facturacionEstandarCtrl.carteraSeleccionada.idProceso != undefined && facturacionEstandarCtrl.carteraSeleccionada.idProceso!= null){
        		
	        	var params = {
	        			fechaPeriodo: facturacionEstandarCtrl.periodoActual.fechaFin,
	        			idProceso: facturacionEstandarCtrl.carteraSeleccionada.idProceso,
	        			idCartera: facturacionEstandarCtrl.carteraSeleccionada.idCarteraCliente
	        	}
	        	
	        	var promesa = FacturacionServicios.ejecutaFacturacionGenerica(params).$promise;
	
	            promesa.then(function (respuesta) {
	            	facturacionEstandarCtrl.bndFacEValida = 'P';
	            });
	
	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al enviar el Procesamiento de Facturación");
	            });
        	}else{
        		 AdeaServicios.alerta("error", "La Cartera Selecciona no cuenta con un Identificador de procesos configurado, favor de contactar a el área de Sistemas");
        	}
        	
        }
        
        function consultaCatalogos(){
        	$log.info('consultaCatalogos');
        	$log.info(facturacionEstandarCtrl.periodo);
        	
        	var params = {
        			idCartera: facturacionEstandarCtrl.carteraSeleccionada.idCarteraCliente,
        			pIdPeriodo: facturacionEstandarCtrl.periodo.idPeriodoFactGral
        	};
        	
        	facturacionEstandarCtrl.parametrosProforma = params;
        	
            var promesa = FacturacionServicios.consultaConceptos(params).$promise;

            promesa.then(function (respuesta) {
            	facturacionEstandarCtrl.catalogoFac = respuesta;
            	var val = 0;
            	
            	angular.forEach(facturacionEstandarCtrl.catalogoFac, function (obj) {
                   if(obj.archivoVal != '---'){
                	   val ++;
                   }
                });
            	
            	if(val == 0){
            		facturacionEstandarCtrl.parametrosProforma = params;
                	facturacionEstandarCtrl.bndProforma = true;
            	}else{
            		facturacionEstandarCtrl.msgVal = 'El proceso arrojo validaciones no cumplidas, favor de validar los archivos de Validación para corregir las incidencias desde la fuente de Datos';
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        }
        
        function downloadArchivoFact(nombreArchivo){
        	
        	var param = {
        			pcNombre: nombreArchivo, 
        			pcRuta: 'out'
        	};
        	

            var descarga = FacturacionServicios.archivoDownload(param).$promise;

            descarga.then(function (dato) {
            	var blob = dato.response.blob;
            	($window).saveAs(blob, nombreArchivo);
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
        }
        
        function confirmarLayouts(){
        	$log.info('confirmarLayouts');
        	facturacionEstandarCtrl.bndProforma = false;
        	var params = {
        			idCartera: facturacionEstandarCtrl.carteraSeleccionada.idCarteraCliente,
        			idPeriodo: facturacionEstandarCtrl.periodo.idPeriodoFactGral
        	};
        	
        	var promesa = ProformaServicios.generaProforma(params).$promise;

        	promesa.then(function (respuesta) {
        		if(respuesta.idProformaCab != null && respuesta.idProformaCab != undefined){
        			facturacionEstandarCtrl.idProformaCab = respuesta.idProformaCab;
        			AdeaServicios.alerta("success", "Se genero de manera Satisfactoria la Proforma");
        			facturacionEstandarCtrl.bndProforma = true;
        		}else{
        			AdeaServicios.alerta("error", "Se genero un error al procesar la proforma "+ respuesta.error);
        		}
        	});

        	promesa.catch(function (error) {
        		AdeaServicios.alerta("error", "Error al generar la proforma");
        	});
        }
        
    }


    facEstandar.$inject = ['$log'];
    function facEstandar() {
        var directiva = {
            controller: FacturacionEstandar,
            restrict: 'E',
            controllerAs: 'facturacionEstandarCtrl',
            transclude: true,
            scope: {
                carteraSeleccionada: '=',
            },
            templateUrl: 'app/directivas/facturacionEstandar/facturacionEstandar.html'
        };

        return directiva;
    }
})();
