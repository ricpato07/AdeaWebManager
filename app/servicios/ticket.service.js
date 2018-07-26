(function () {
    "use strict";

    /**
	 * @ngdoc service
	 * @name mantenimientos.service:mantenimientosServicios
	 * @descripcion Definicion de los servicios de los mantenimientos dentro del
	 *              sistema
	 */
    angular
        .module('serviciosModulo')
        .factory('ticketServicios', ticketServicios);

    ticketServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function ticketServicios($resource, $window, serviceUrl, toaster) {

        var categorias = $resource(serviceUrl + 'ticket/getCategorias.action', {}, {
            consultaCat: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idArea: '@idArea'
                }
            }
        });
        
        
        var tickets = $resource(serviceUrl + 'ticket/:servicio', {servicio: '@servicio'}, {
        	altaTicket: {
                method: 'POST', headers: {'Content-Type': undefined}, transformRequest: angular.identity
            },
            consultaTicketGral: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	login: '@login',
                	tipo: '@tipo',
                	estatus: '@estatus',
                	fechaIni: '@fechaIni',
                	fechaFin: '@fechafin',
                	idTicket: '@idTicket'
                }
            },
            modDatosGral: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    ticket: '@ticket'
                }
            },
            regArchivo: {
                method: 'POST', headers: {'Content-Type': undefined}, transformRequest: angular.identity
            },
            consultaArchivo: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idTicket: '@idTicket'
                }
            },
            registraRelTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	relacion: '@relacion'
                }
            },
            consultaRelTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idTicket: '@idTicket'
                }
            },
            eliminaRelTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	idTicketRelacion: '@idTicketRelacion'
                }
            },
            guardaNotaTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	nota: '@nota'
                }
            },
            consultaNotaTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idTicket: '@idTicket'
                }
            },
            modNotaTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	nota: '@nota'
                }
            },
            elimNotaTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	idObservacionTicket: '@idObservacionTicket'
                }
            },
            consLogTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idTicket: '@idTicket'
                }
            },
            descargarAdjunto : {
				method : 'POST', headers : {'Content-Type': 'application/json', accept: 'application/octet-stream'},
				params: {
					pcNombre: '@pcNombre',
					pcRuta: '@pcRuta'
				},
				responseType: 'arraybuffer', cache: false,
				transformResponse: function (data, headers) {
                    var excel = null;
                    if (data) {
                        excel = new Blob([data], {
                            type: 'application/octet-stream'
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
			eliminaArchivoAdjunto: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                	pcIdArchivoTicket: '@pcIdArchivoTicket',
                	pcNombre: '@pcNombre',
                	pcRuta: '@pcRuta'
                }
            }
        });

        

        var serviciosTicket = {
            consultaCategorias: consultaCategorias,
            registrarTicket: registrarTicket,
            consultaTicket: consultaTicket,
            modificacionDatosGrl: modificacionDatosGrl,
            registrarArchivo: registrarArchivo,
            consultaArchivosTicket: consultaArchivosTicket,
            registraRelacionTicket: registraRelacionTicket,
            consultaRelacionTicket: consultaRelacionTicket,
            eliminaTicketRelacion: eliminaTicketRelacion,
            guardarNotaTicket: guardarNotaTicket,
            consultaObservaciones: consultaObservaciones,
            modificaNotaTicket: modificaNotaTicket,
            eliminarNota: eliminarNota,
            consultaLogTicket: consultaLogTicket,
            descargarArchivoAdjuntos: descargarArchivoAdjuntos,
            eliminaAdjunto: eliminaAdjunto 
        };

        return serviciosTicket;

        /**
		 * @ngdoc function
		 * @name mantenimientos.mantenimientosServicios#agregarUsuario
		 * @methodOf mantenimientos.service:mantenimientosServicios
		 * 
		 * @description Funcion encargada de agregar al usuario
		 * 
		 * @param {
		 *            Object } parametros : parametros para realizar la
		 *            operacion
		 * @param {
		 *            String } servicios : servicio para realizar la operacion
		 * 
		 * @return { Object } el usuario que ha sido agregado
		 * 
		 */
        function consultaCategorias(params) {
            return categorias.consultaCat(params);
        }
        
        function registrarTicket(params) {
            return tickets.altaTicket({servicio: 'registrarTicket.action'}, params);
        }
        
        function consultaTicket(params) {
            return tickets.consultaTicketGral({servicio: 'getByUsuario.action'}, params);
        }
        
        function modificacionDatosGrl(params){
        	return tickets.modDatosGral({servicio: 'modificarTicket.action'}, params);
        }
        
        function registrarArchivo(params){
        	return tickets.regArchivo({servicio: 'registrarArchivo.action'}, params);
        }
        
        function consultaArchivosTicket(params){
        	return tickets.consultaArchivo({servicio: 'getArchivosTicket.action'}, params);
        }
        
        function registraRelacionTicket(params){
        	return tickets.registraRelTicket({servicio: 'guardaRelacionTicket.action'}, params);
        }
        
        function consultaRelacionTicket(params){
        	return tickets.consultaRelTicket({servicio: 'getRelacionTicket.action'}, params);
        }
        
        function eliminaTicketRelacion(params){
        	return tickets.eliminaRelTicket({servicio: 'eliminarRelacionTicket.action'}, params);
        }
        
        function guardarNotaTicket(params){
        	return tickets.guardaNotaTicket({servicio: 'guardarNotaTicket.action'}, params);
        }
        
        function consultaObservaciones(params){
        	return tickets.consultaNotaTicket({servicio: 'consultaObservaciones.action'}, params);
        }
        
        function modificaNotaTicket(params){
        	return tickets.modNotaTicket({servicio: 'modificaNotaTicket.action'}, params);
        }
        
        function eliminarNota(params){
        	return tickets.elimNotaTicket({servicio: 'eliminaNotaTicket.action'}, params);
        }
        
        function consultaLogTicket(params){
        	return tickets.consLogTicket({servicio: 'consultaLogTicket.action'}, params);
        }
        
        function descargarArchivoAdjuntos(params){
        	return tickets.descargarAdjunto({servicio: 'archivoDownload.action'}, params);
        }
        
        function eliminaAdjunto(params){
        	return tickets.eliminaArchivoAdjunto({servicio: 'eliminaAdjunto.action'}, params);
        	
        }
        
        
    }
})();
