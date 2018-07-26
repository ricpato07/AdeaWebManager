/**
 * 
 */
(function() {
	"use strict";

	/**
	 * @ngdoc service
	 * @name mantenimientos.service:mantenimientosServicios
	 * @descripcion Definicion de los servicios de los mantenimientos dentro del
	 *              sistema
	 */
	angular.module('serviciosModulo').factory('FacturacionServicios', FacturacionServicios);

	FacturacionServicios.$inject = [ '$resource', '$window', 'serviceUrl', 'toaster' ];

	function FacturacionServicios($resource, $window, serviceUrl, toaster) {

		var consultas = $resource(serviceUrl + 'facturacion/:servicio', {servicio : '@servicio'}, {
			validaPeriodos : {
				method : 'POST', headers : {'Content-Type' : 'application/json'}
			},
			gruposConceptos : {
				method : 'POST', headers : {'Content-Type' : 'application/json'}, isArray : true
			},
			conceptos : {
				method : 'POST', headers : {'Content-Type' : 'application/json'}, isArray : true,
				params : {
					pBBDD: '@pBBDD',
					pIdPeriodo: '@pIdPeriodo',
					idCartera: '@idCartera'
				}
			},
			clientes: {
				method : 'POST', headers : {'Content-Type' : 'application/json'}, isArray : true
			},
			periodos:{
				method : 'POST', headers : {'Content-Type' : 'application/json'}
			},
			actPeriodo: {
				method : 'POST', headers : {'Content-Type' : 'application/json'},
				params : {
					idPeriodo: '@idPeriodo'
				}
			},
			logFac: {
				method : 'POST', headers : {'Content-Type' : 'application/json'},
				params : {
					idProceso: '@idProceso',
					estatus: '@estatus'
				}
			},
			consultaCarteraCli: {
				method : 'POST', headers : {'Content-Type' : 'application/json'}, isArray : true,
				params : {
					scltcod: '@scltcod'
				}
			},
			consultaPeriodoAct: {
				method : 'POST', headers : {'Content-Type' : 'application/json'}
			},
			consLogFacExis: {
				method : 'POST', headers : {'Content-Type' : 'application/json'},
				params : {
					idProceso: '@idProceso'
				}
			},
			consultaIncExis: {
				method : 'POST', headers : {'Content-Type' : 'application/json'}, isArray : true,
				params : {
					idPeriodo: '@idPeriodo'
				}
			},
			consultaFacGralExis: {
				method : 'POST', headers : {'Content-Type' : 'application/json'},
				params : {
					idCartera: '@idCartera'
				}
			},
			consultaCatGral: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray : true,
		    	params: {
		    		idCarteraCliente: '@idCarteraCliente'
		    	}
		    },
		    consPeriodoGral: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray : true,
		    	params: {
		    		idCarteraCliente: '@idCarteraCliente',
		    		tipoCartera: '@tipoCartera'
		    	}
		    },
		    consPeriodoArcGral: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray : true
		    },
		    consConfProforma: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray : true,
		    	params: {
		    		idCartera: '@idCartera'
		    	}
		    }
		});
		
		var generacion = $resource(serviceUrl + 'facturacion/:servicio', {servicio : '@servicio'}, {
			layout : {
				method : 'POST', headers : {'Content-Type' : 'application/json'},
				params: {
					fechaPeriodo: '@fechaPeriodo'
				}
			},
			genPeriodos : {
				method : 'POST', headers : {'Content-Type' : 'application/json'}
			},
		    subirArchivo: {
		    	method: 'POST', headers: {'Content-Type': undefined}, 
		    	transformRequest: angular.identity
		    },
		    ejecutaFactGen : {
		    	method: 'POST', headers: {'Content-Type': 'application/json'},
				params: {
					fechaPeriodo: '@fechaPeriodo',
					idProceso: '@idProceso',
					idCartera: '@idCartera'
				}
		    },
		    subirLayInc: {
		    	method: 'POST', headers: {'Content-Type': undefined}, 
		    	transformRequest: angular.identity
		    },
		    altaConfProforma: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'},
				params: {
					config: '@config'
				}
		    },
		    editConfProforma: {
		    	method: 'POST', headers: {'Content-Type': 'application/json'},
				params: {
					config: '@config'
				}
		    }
		});
		
		var archivo = $resource(serviceUrl + 'archivo/:servicio', {servicio : '@servicio'}, {
			descargar : {
				method : 'POST', headers : {'Content-Type': 'application/json', accept: 'application/vnd.ms-excel'},
				params: {
					pcNombre: '@pcNombre',
					pcRuta: '@pcRuta'
				},
				responseType: 'arraybuffer', cache: false,
				transformResponse: function (data, headers) {
                    var excel = null;
                    if (data) {
                        excel = new Blob([data], {
                            type: 'application/vnd.ms-excel;charset=utf-8'
                        });
                    }
                    var result = {
                        blob: excel
                    };

                    return {
                        response: result
                    };
                }
			},
			descargarfile : {
				method : 'POST', headers : {'Content-Type': 'application/json', accept: 'application/excel'},
				params: {
					pcNombre: '@pcNombre',
					pcRuta: '@pcRuta'
				},
				responseType: 'arraybuffer', cache: false,
				transformResponse: function (data, headers) {
                    var excel = null;
                    if (data) {
                        excel = new Blob([data], {
                            type: 'application/excel;charset=utf-8'
                        });
                    }
                    var result = {
                        blob: excel
                    };

                    return {
                        response: result
                    };
                }
			}
		});


		var serviciosFacturacion = {
			validacionPeriodos : validacionPeriodos,
			generaLayout: generaLayout,
			generaPeriodos: generaPeriodos,
			consultaGrpConcepto: consultaGrpConcepto,
			consultaConceptos: consultaConceptos,
			consultaClientes: consultaClientes,
			validaPeriodoMes: validaPeriodoMes,
			descargarArchivo: descargarArchivo,
			actualizaPeriodo: actualizaPeriodo,
			subirLayout: subirLayout,
			consultaLog: consultaLog,
			archivoDownload: archivoDownload,
			consultaCarteraCliente: consultaCarteraCliente,
			consultaPeriodoActual: consultaPeriodoActual,
			ejecutaFacturacionGenerica: ejecutaFacturacionGenerica,
			consultaLogFacExis: consultaLogFacExis,
			subirLayoutIncidencias: subirLayoutIncidencias,
			consultaIncidenciasExis: consultaIncidenciasExis,
			consultaFacturacionGralExis: consultaFacturacionGralExis,
			consultaCatalogosGral: consultaCatalogosGral,
			consultaPeriodosFacGral: consultaPeriodosFacGral,
			consultaPeriodosArcGral: consultaPeriodosArcGral,
			consultaConfiguracionProforma: consultaConfiguracionProforma,
			altaConfiguracionProforma: altaConfiguracionProforma,
			editarConfiguracionProforma: editarConfiguracionProforma
		};

		return serviciosFacturacion;

		function validacionPeriodos() {
			return consultas.validaPeriodos({servicio: 'getValidaPeriodos.action'});
		};
		
		function generaLayout(params) {
			return generacion.layout({servicio: 'generaLayout.action'}, params);
		};

		function generaPeriodos() {
			return generacion.genPeriodos({servicio: 'generaPeriodos.action'});
		};
		
		
		function consultaGrpConcepto() {
			return consultas.gruposConceptos({servicio: 'getCatalogoGrpConceptos.action'});
		};
		
		function consultaConceptos(params) {
			return consultas.conceptos({servicio: 'getCatalogoConceptos.action'}, params);
		};
		
		function consultaClientes(params) {
			return consultas.clientes({servicio: 'getClientesFacturacion.action'}, params);
		};
		
		function validaPeriodoMes() {
			return consultas.periodos({servicio: 'validaPeriodoMes.action'});
		};
		
		function descargarArchivo(params) {
			return archivo.descargar({servicio: 'excelDownload.action'}, params);
		};
		
		function archivoDownload(params) {
			return archivo.descargarfile({servicio: 'archivoDownload.action'}, params);
		};
		
		function actualizaPeriodo(params){
			return consultas.actPeriodo({servicio: 'actualizaPeriodo.action'}, params);
		};
		
	    function subirLayout(params) {
	        return generacion.subirArchivo({servicio: 'subirLayout.action'}, params);
	    }
	    
	    function consultaLog(params) {
	        return consultas.logFac({servicio: 'consultaLogFac.action'}, params);
	    }
	    
	    function consultaCarteraCliente(params) {
	        return consultas.consultaCarteraCli({servicio: 'consultaCarteraCliente.action'}, params);
	    }
	    
	    function consultaPeriodoActual(params) {
	        return consultas.consultaPeriodoAct({servicio: 'consultaPeriodoActual.action'}, params);
	    }
	    
	    function ejecutaFacturacionGenerica(params) {
	        return generacion.ejecutaFactGen({servicio: 'ejecutaFacturacionGenerica.action'}, params);
	    }
	    
	    function consultaLogFacExis(params) {
	        return consultas.consLogFacExis({servicio: 'consultaLogFacExis.action'}, params);
	    }
	    
	    function subirLayoutIncidencias(params) {
	        return generacion.subirLayInc({servicio: 'subirLayoutIncidencias.action'}, params);
	    }
	    
	    function consultaIncidenciasExis(params) {
	        return consultas.consultaIncExis({servicio: 'consultaIncidenciasExis.action'}, params);
	    }
	    
	    function consultaFacturacionGralExis(params) {
	        return consultas.consultaFacGralExis({servicio: 'consultaFacGralExis.action'}, params);
	    }
	    
	    function consultaCatalogosGral(params) {
	        return consultas.consultaCatGral({servicio: 'consultaCatalogosGral.action'}, params);
	    }
	    
	    function consultaPeriodosFacGral(params) {
	        return consultas.consPeriodoGral({servicio: 'consultaPeriodosFacGral.action'}, params);
	    }
	    
	    function consultaPeriodosArcGral(params) {
	        return consultas.consPeriodoArcGral({servicio: 'consultaPeriodosArcGral.action'}, params);
	    }
	    
	    function consultaConfiguracionProforma(params){
	        return consultas.consConfProforma({servicio: 'consultaConfiguracionProforma.action'}, params);
	    }
	    
	    function altaConfiguracionProforma(params){
	        return generacion.altaConfProforma({servicio: 'altaConfiguracionProforma.action'}, params);
	    }
	    
	    function editarConfiguracionProforma(params){
	        return generacion.editConfProforma({servicio: 'editarConfiguracionProforma.action'}, params);
	    }
	    
	}
})();
