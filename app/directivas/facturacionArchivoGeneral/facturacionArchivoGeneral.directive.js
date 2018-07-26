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
        .controller('FacturacionArchivoGeneral', FacturacionArchivoGeneral)
        .directive('facArchivoGral', facArchivoGral);

    FacturacionArchivoGeneral.$inject = ['$log', '$scope', 'AdeaServicios', '$filter', '$compile', 'FacturacionServicios', '$window', 'tblIncidencias'];

    function FacturacionArchivoGeneral($log, $scope, AdeaServicios, $filter, $compile, FacturacionServicios, $window, tblIncidencias) {

        var facturacionArchivoGeneralCtrl = this;
        
        facturacionArchivoGeneralCtrl.tblIncidencias = tblIncidencias;
        
        facturacionArchivoGeneralCtrl.carteraSeleccionada = $scope.carteraSeleccionada;
        facturacionArchivoGeneralCtrl.generaLayout = generaLayout;
        facturacionArchivoGeneralCtrl.consultaCatalogosIncidencias = consultaCatalogosIncidencias;
        facturacionArchivoGeneralCtrl.descargarExcel = descargarExcel;
        facturacionArchivoGeneralCtrl.consultaCatalogos = consultaCatalogos;
        facturacionArchivoGeneralCtrl.downloadArchivoFact = downloadArchivoFact;
        facturacionArchivoGeneralCtrl.generaPeriodos = generaPeriodos;
        facturacionArchivoGeneralCtrl.uploadDocumento = uploadDocumento;
        facturacionArchivoGeneralCtrl.uploadIncidencias = uploadIncidencias;
        facturacionArchivoGeneralCtrl.bndGeneraPeriodos = true;
        facturacionArchivoGeneralCtrl.bndProcesoInc = false;
        facturacionArchivoGeneralCtrl.bndCargarArchivo = true;
        consultaPeriodosValidos();
        
        function consultaPeriodosValidos(){
        	$log.info('consultaPeriodosValidos');
        	
            var promesa = FacturacionServicios.validaPeriodoMes().$promise;

            promesa.then(function (respuesta) {
            		if(respuesta.error == 'ok'){
            			
            			var params = {
                    			idProceso: 7001101,
                    			estatus: 'P'
                    	}
                    	
                        var promesa = FacturacionServicios.consultaLog(params).$promise;

                        promesa.then(function (respuesta) {
                        	if(respuesta.idError == null){
                        		
                        		var params = {
                            			idProceso: 7001101,
                            			estatus: 'E'
                            	}
                            	
                                var promesa = FacturacionServicios.consultaLog(params).$promise;

                                promesa.then(function (respuesta) {
                                	if(respuesta.idError  == null){

                                		var params = {
                                    			idProceso: 7101101,
                                    			estatus: 'P'
                                    	}
                                    	
                                        var promesa = FacturacionServicios.consultaLog(params).$promise;

                                        promesa.then(function (respuesta) {
                                        	if(respuesta.idError == null){
                                		
                                        		var params = {
                                            			idProceso: 7101101,
                                            			estatus: 'E'
                                            	}
                                            	
                                                var promesa = FacturacionServicios.consultaLog(params).$promise;

                                                promesa.then(function (respuesta) {
                                                	consultaPeriodos();
                                                	if(respuesta.idError  != null){
                                                		facturacionArchivoGeneralCtrl.bndGeneraFac = 'V';
                                                		facturacionArchivoGeneralCtrl.errores2 = respuesta;
													}
                                                	
                                                });
                                        	}else{
                                        		facturacionArchivoGeneralCtrl.bndGeneraFac = 'L'
											}
                                        });	
   
    	            				}else{
    	            					facturacionArchivoGeneralCtrl.errores = respuesta;
    	            				}
                                });
                			}else{
                				facturacionArchivoGeneralCtrl.bndGeneraFac = 'L';
                			}
                        });
            			
            		}else{
            			facturacionArchivoGeneralCtrl.bndGeneraFac = 'F';
            		}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
        
        
        function consultaPeriodos() {
			$log.info('consultaPeriodos');
			facturacionArchivoGeneralCtrl.periodos = {};

            var promesa = FacturacionServicios.validacionPeriodos().$promise;

            promesa.then(function (respuesta) {
            		
            	if(respuesta.awmPeriodosFacturados != null && respuesta.awmPeriodosFacturados != '' && respuesta.awmPeriodosFacturados != undefined){
            		facturacionArchivoGeneralCtrl.periodoExistente = respuesta.awmPeriodosFacturados;
            		facturacionArchivoGeneralCtrl.periodos.fecHasta = respuesta.fecHasta;
            		consultaGrpCatalogos();
            		facturacionArchivoGeneralCtrl.bndGeneraFac = 'V';
            		
            		if(facturacionArchivoGeneralCtrl.periodoExistente.bndLayouts == 'S'){
            			//Consulta incidencias
            			consultaIncidencias();
            		}
            	}else if(respuesta.fecHasta != null && respuesta.awmPeriodosFacturados == null){
            		facturacionArchivoGeneralCtrl.periodos = respuesta;
            		facturacionArchivoGeneralCtrl.bndGeneraFac = 'V';
            	}else{
            		facturacionArchivoGeneralCtrl.bndGeneraFac = 'G';
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los periodos");
            })
        }
        
        function generaLayout(){
        	$log.info('generaPeriodos');
        	var params = {
        			fechaPeriodo: facturacionArchivoGeneralCtrl.periodos.fecHasta
        	}
        	
            var promesa = FacturacionServicios.generaLayout(params).$promise;

            promesa.then(function (respuesta) {
            	
            	if (respuesta.error == 'ok') {

            		var params = {
                			idProceso: 7101101,
                			estatus: 'P'
                	}
                	
                    var promesa = FacturacionServicios.consultaLog(params).$promise;

                    promesa.then(function (respuesta) {
                    	if(respuesta.idError == null){
                    		var params = {
                        			idProceso: 7101101,
                        			estatus: 'E'
                        	}
                        	
                            var promesa = FacturacionServicios.consultaLog(params).$promise;

                            promesa.then(function (respuesta) {
                            	if(respuesta.idError  == null){
                            		facturacionArchivoGeneralCtrl.bndGeneraFac = 'C'
	            				}else{
	            					facturacionArchivoGeneralCtrl.bndErrLayout = 'E';
	            					facturacionArchivoGeneralCtrl.errores = respuesta;
	            				}
                            });
                    	} else {
                    		facturacionArchivoGeneralCtrl.bndGeneraFac = 'L';
                    	}
                    });
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
        
        function consultaCatalogosIncidencias(){
        	$log.info('consultaCatalogos');
        	
        	var params = {
        			pBBDD: facturacionArchivoGeneralCtrl.grpSeleccionadoIncidencias,
        			pIdPeriodo: facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados
        	};
        	
            var promesa = FacturacionServicios.consultaConceptos(params).$promise;

            promesa.then(function (respuesta) {
            	facturacionArchivoGeneralCtrl.catalogoFacIncidencias = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
        
        function descargarExcel() {

        	var param = {pcNombre: facturacionArchivoGeneralCtrl.periodoExistente.nombreArchivo, pcRuta: 'in'};

            var descarga = FacturacionServicios.descargarArchivo(param).$promise;

            descarga.then(function (dato) {
            	var blob = dato.response.blob;
            	($window).saveAs(blob, facturacionArchivoGeneralCtrl.periodoExistente.nombreArchivo);
            	actualizaPeriodo();
            	
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
               
        }
        
        function actualizaPeriodo(){
        	$log.info('actualizaPeriodo');
        	var params = {
        			idPeriodo: facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados
        	}
        	
        	$log.info(facturacionArchivoGeneralCtrl.periodoExistente.fechaPeriodo);
        
            var promesa = FacturacionServicios.actualizaPeriodo(params).$promise;

            promesa.then(function (respuesta) {
            	AdeaServicios.alerta("success", "Favor de complementar la información del Layout, para poder adjuntarlo");
            	facturacionArchivoGeneralCtrl.periodoExistente = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al actualizar el periodo");
            });
        	
        }
        
        function consultaGrpCatalogos(){
        	$log.info('consultaGrpCatalogos');
        	
            var promesa = FacturacionServicios.consultaGrpConcepto().$promise;

            promesa.then(function (respuesta) {
            	facturacionArchivoGeneralCtrl.grpCatalogo = respuesta;
            	facturacionArchivoGeneralCtrl.grpSeleccionado = respuesta[0].key;
            	consultaCatalogos();  		
            		
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
        
        function consultaCatalogos(){
        	$log.info('consultaCatalogos');
        	
        	var params = {
        			pBBDD: facturacionArchivoGeneralCtrl.grpSeleccionado,
        			pIdPeriodo: facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados
        	};
        	
            var promesa = FacturacionServicios.consultaConceptos(params).$promise;

            promesa.then(function (respuesta) {
            	facturacionArchivoGeneralCtrl.catalogoFac = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        }
        
        function downloadArchivoFact(concepto){
        	
        	var param = {pcNombre: concepto.nombreArc, pcRuta: 'out'};

            var descarga = FacturacionServicios.archivoDownload(param).$promise;

            descarga.then(function (dato) {
            	var blob = dato.response.blob;
            	($window).saveAs(blob, concepto.nombreArc);
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
        }
        
        function uploadDocumento(){
        	$log.info('uploadDocumento');
        	
        	$log.info(facturacionArchivoGeneralCtrl.archivo);
        	
        	var formData = new FormData();
        	
        	formData.append('file', facturacionArchivoGeneralCtrl.archivo);
        	formData.append('idPeriodo', facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados);
        	formData.append('numRegistros', facturacionArchivoGeneralCtrl.periodoExistente.numRegistros);
        	formData.append('idCartera', facturacionArchivoGeneralCtrl.carteraSeleccionada.idCarteraCliente);
        	
        	 var promesa = FacturacionServicios.subirLayout(formData).$promise;

             promesa.then(function (respuesta) {
             	
             	if (respuesta.error == 'ok') {
             		AdeaServicios.alerta("success", "Se ejecuto correctamente el proceso para validar el archivo subido, Favor de Regresar mas Tarde, el proceso puede tardar varios minutos");
             		facturacionArchivoGeneralCtrl.bndCargarArchivo = false;
             		facturacionArchivoGeneralCtrl.bndGeneraFac = 'L'
             	}else{
             		AdeaServicios.alerta("error", respuesta.error);
             	}
             });

             promesa.catch(function (error) {
                 AdeaServicios.alerta("error", "Error al subir el archivo, el archivo no cumple con el layout valido");
             });
        }
        
        function generaPeriodos(){
        	$log.info('generaPeriodos');
        	
            var promesa = FacturacionServicios.generaPeriodos().$promise;

            promesa.then(function (respuesta) {
            	
            	if (respuesta.error == 'ok') {
            		facturacionArchivoGeneralCtrl.bndGeneraPeriodos = false;
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        }
        
        
        function uploadIncidencias(){

        	$log.info('uploadDocumento');
        	
        	var formData = new FormData();
        	
        	formData.append('file', facturacionArchivoGeneralCtrl.archivoInicidencias);
        	formData.append('idPeriodo', facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados);
        	formData.append('idCatSeleccionado', facturacionArchivoGeneralCtrl.conceptoSelIncidencias);
        	
        	 var promesa = FacturacionServicios.subirLayoutIncidencias(formData).$promise;

             promesa.then(function (respuesta) {
             	
             	if (respuesta.error == 'ok') {
             		AdeaServicios.alerta("success", "Se ejecuto correctamente el proceso para validar el archivo subido, Favor de Regresar mas Tarde, el proceso puede tardar varios minutos");
             		facturacionArchivoGeneralCtrl.bndCargarArchivo = false;
             		facturacionArchivoGeneralCtrl.bndGeneraFac = 'L'
             	}else{
             		AdeaServicios.alerta("error", respuesta.error);
             	}
             });

             promesa.catch(function (error) {
                 AdeaServicios.alerta("error", "Error al subir el archivo, el archivo no cumple con el layout valido");
             });
        }
        
        function consultaIncidencias(){
        	$log.info('consultaIncidencias');
        	
        	var params = {
        			idPeriodo: facturacionArchivoGeneralCtrl.periodoExistente.idPeriodosFacturados
        	};
        	
            var promesa = FacturacionServicios.consultaIncidenciasExis(params).$promise;

            promesa.then(function (respuesta) {
            	
            	facturacionArchivoGeneralCtrl.incidencias = respuesta;
            	var cont = 0;
            	angular.forEach(facturacionArchivoGeneralCtrl.incidencias, function (obj) {
            		if(obj.bndCarga == 'P'){
            			cont ++;
            		}
            	});
            	
            	if(cont > 0){
            		facturacionArchivoGeneralCtrl.bndProcesoInc = false;
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar las Incidencias");
            });
        }
    }


    facArchivoGral.$inject = ['$log'];
    function facArchivoGral() {
        var directiva = {
            controller: FacturacionArchivoGeneral,
            restrict: 'E',
            controllerAs: 'facturacionArchivoGeneralCtrl',
            transclude: true,
            scope: {
                carteraSeleccionada: '=',
            },
            templateUrl: 'app/directivas/facturacionArchivoGeneral/facturacionArchivoGeneral.html'
        };

        return directiva;
    }
})();
