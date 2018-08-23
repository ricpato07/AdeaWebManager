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
        .factory('proyectoServicios', proyectoServicios);

    proyectoServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function proyectoServicios($resource, $window, serviceUrl, toaster) {

        var clientes = $resource(serviceUrl + 'cliente/:servicio', {servicio: '@servicio'}, {
            consulta: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
        
            consultaGrl: {
            method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
            params: {
            	estatus: '@estatus'
            }
        }
        });

        var proyectos = $resource(serviceUrl + 'proyectos/:servicio', {servicio: '@servicio'}, {
            consulta: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pidCliente: '@pidCliente'
                }
            },

            consultaSubProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pidProyecto: '@pidProyecto'
                }
            },
        });


        var plantilla = $resource(serviceUrl + 'proyectos/:servicio', {servicio: '@servicio'}, {
            consulta: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdPlantilla: '@pIdPlantilla',
                    pIdPerfil: '@pIdPerfil',
                    estatus: '@estatus',
                    idArea: '@idArea',
                    login: '@login'
                }
            },

            insertar: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    recurso: '@recurso'
                }
            },
            editar: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    recurso: '@recurso'
                }
            },
            consultaAreaPlantilla : {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	pIdPlantilla: '@pIdPlantilla',
                	pIdArea: '@pIdArea'
                }
            },
            consultaCostoPlantilla  : {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	pIdPlantilla: '@pIdPlantilla'
                }
            },
            consultaArea: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	idArea: '@idArea',
                	estatus: '@estatus'
                }
            },
            consultaPlanActi: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	pIdPlantilla: '@pIdPlantilla',
                	fecIni: '@fecIni',
                	fecFin: '@fecFin',
                	idActividad: '@idActividad'
                }
            },
            
            insertarActPlan: {
            	 method: 'POST', headers: {'Content-Type': 'application/json'},
            	 params: {
            		 actividadPlantilla: '@actividadPlantilla'
                 }
            },
            
            insertarActPlanConf: {
           	 	method: 'POST', headers: {'Content-Type': 'application/json'},
            	params:{
            		actividadPlantilla: '@actividadPlantilla'
            	}
            },
            eliminarActPlan: {
           	 	method: 'POST', headers: {'Content-Type': 'application/json'},
           	 	params: {
           	 		pIdActividad: '@pIdActividad',
           	 		pIdPlantilla: '@pIdPlantilla'
           	 	}
            }
        });

        var subproyecto = $resource(serviceUrl + 'proyectos/:servicio', {servicio: '@servicio'}, {
            agregarSubProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    subProyecto: '@subProyecto'// ,
                    // listActividad: '@listActividad'
                }
            },
            editarSubProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            agregarActividad: {
            	method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            eliminarActividad:{
            	method: 'POST', headers: {'Content-Type': 'application/json'},
            	params: {
            		pIdActividad: '@pIdActividad'
                }
            },
            modificaActividad:{
            	method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            consultaActi:{
            	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
            	params: {
            		pIdSubProyecto: '@pIdSubProyecto',
            		pIdActividad: '@pIdActividad'
                }
            },
            getRango : {
            	method: 'POST', headers: {'Content-Type': 'application/json'},
            	params: {
            		rangos: '@rangos'
                }
            },
            getRecursosSubproyecto: {
            	method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
            	params: {
            		pIdSubproyecto: '@pIdSubproyecto'
                }
            }
        });

        var ctrlProd = $resource(serviceUrl + 'ctrlProd/:servicio', {servicio: '@servicio'}, {
            consAreas: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdArea: '@pIdArea'
                }
            },
            consProyCtrl: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdArea: '@pIdArea',
                    idProceso: '@idProceso',
                    cliente: '@cliente'
                }
            },
            consAct: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdArea: '@pIdArea',
                    pIdActividad: '@pIdActividad',
                    pIdClasificacion: '@pIdClasificacion'
                }
            },
            consDesa: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    idDesarrollo: '@idDesarrollo',
                    cliente: '@cliente',
                    plataforma: '@plataforma',
                    estatus: '@estatus'
                }
            }
        });

        var tickets = $resource(serviceUrl + 'proyectos/:servicio', {servicio: '@servicio'}, {
            consultaTick: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdTicket: '@pIdTicket'
                }
            }
        });

        var areas = $resource(serviceUrl + 'area/:servicio', {servicio: '@servicio'}, {
            consultaAreaAWM: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    pIdArea: '@pIdArea',
                    pIdResponsable: '@pIdResponsable'
                }
            },
            consultaAreaObjeto: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    idArea: '@idArea'
                }
            }
        });

        var reportes = $resource(serviceUrl + 'reportes/:servicio', {servicio: '@servicio'}, {
            getIndicadores: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
        
        	consultaCliComp: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
        		params: {
        			pInd: '@pInd'
        		}
        	},
        	consultaCliContratos: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaCliSContratos: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProyCContratos: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProyCAnexo: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProyCPoliza: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProySContratos: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProySAnexo: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaProySPoliza: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
        	},
        	consultaContrVigentes: {
        		method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
        		params: {
        			pSigno: '@pSigno'
        		}
        	}
        });

        var serviciosProyectos = {
            consultaClientes: consultaClientes,
            consultaProyecto: consultaProyecto,
            consultaSubProyecto: consultaSubProyecto,
            consultaPlantilla: consultaPlantilla,
            insertarRecurso: insertarRecurso,
            editarRecurso: editarRecurso,
            agregarSubproyecto: agregarSubproyecto,
            editarSubProyecto: editarSubProyecto,
            consultaAreas: consultaAreas,
            consultaProyectosCtrl: consultaProyectosCtrl,
            consultaActividadesCtrl: consultaActividadesCtrl,
            consultaDesarrollo: consultaDesarrollo,
            consultaTickets: consultaTickets,
            consultaAreasAWM: consultaAreasAWM,
            consultaAreaObjeto: consultaAreaObjeto,
            getIndicadoresRep: getIndicadoresRep,
            consultaClientesCompletos: consultaClientesCompletos,
            agregarActividadSub: agregarActividadSub,
            eliminaActividad: eliminaActividad,
            modificarActividad: modificarActividad,
            consultaClientesContrato: consultaClientesContrato,
            consultaClientesSContrato: consultaClientesSContrato,
            consultaProyectosCContrato: consultaProyectosCContrato,
            consultaProyectosCAnexo: consultaProyectosCAnexo,
            consultaProyectosCPoliza: consultaProyectosCPoliza,
            consultaProyectosSContrato: consultaProyectosSContrato,
            consultaProyectosSAnexo: consultaProyectosSAnexo,
            consultaProyectosSPoliza: consultaProyectosSPoliza,
            consultaContratosVigentes: consultaContratosVigentes,
            consultaAreaPlant: consultaAreaPlant,
            consultaCostoPlant: consultaCostoPlant,
            consultaActividades: consultaActividades,
            consultaPlantillaArea: consultaPlantillaArea,
            consultaPlantillaActividad: consultaPlantillaActividad,
            insertarActividadPlantilla: insertarActividadPlantilla,
            insertarActPlant: insertarActPlant,
            eliminarActPlantilla: eliminarActPlantilla,
            consultaClientesGeneral: consultaClientesGeneral,
            consultaRango: consultaRango, 
            consultaRecursosSubproyecto: consultaRecursosSubproyecto
        };

        return serviciosProyectos;

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
        function consultaClientes() {
            return clientes.consulta({servicio: 'getClientes.action'});
        }
        
        function consultaClientesGeneral(params) {
            return clientes.consultaGrl({servicio: 'getClientesGeneral.action'}, params);
        }


        function consultaProyecto(params) {
            return proyectos.consulta({servicio: 'getProyectos.action'}, params);
        }

        function consultaSubProyecto(params) {
            return proyectos.consultaSubProy({servicio: 'getSubProyectos.action'}, params);
        }

        function consultaPlantilla(params) {
            return plantilla.consulta({servicio: 'getPlantilla.action'}, params);
        }
        
        function consultaPlantillaArea(params) {
            return plantilla.consultaArea({servicio: 'getPlantillaArea.action'}, params);
        }

        function insertarRecurso(params) {
            return plantilla.insertar({servicio: 'agregarRecurso.action'}, params);
        }

        function editarRecurso(params) {
            return plantilla.editar({servicio: 'editarRecurso.action'}, params);
        }

        function agregarSubproyecto(params) {
            return subproyecto.agregarSubProy({servicio: 'agregarSubproyecto.action'}, params);
        }

        function editarSubProyecto(params) {
            return subproyecto.editarSubProy({servicio: 'editarSubproyecto.action'}, params);
        }

        function consultaAreas(params) {
            return ctrlProd.consAreas({servicio: 'getAreas.action'}, params);
        }

        function consultaProyectosCtrl(params) {
            return ctrlProd.consProyCtrl({servicio: 'getProyectos.action'}, params);
        }

        function consultaActividadesCtrl(params) {
            return ctrlProd.consAct({servicio: 'getActividades.action'}, params);
        }

        function consultaDesarrollo(params) {
            return ctrlProd.consDesa({servicio: 'getDesarrollo.action'}, params);
        }

        function consultaTickets(params) {
            return tickets.consultaTick({servicio: 'consultaTicket.action'}, params);
        }

        function consultaAreasAWM(params) {
            return areas.consultaAreaAWM({servicio: 'consultaAreas.action'}, params);
        }
        
        function consultaAreaObjeto(params) {
            return areas.consultaAreaObjeto({servicio: 'consultaArea.action'}, params);
        }

        function getIndicadoresRep(params) {
            return reportes.getIndicadores({servicio: 'getResumen.action'}, params);
        }
        
        function consultaClientesCompletos(params) {
            return reportes.consultaCliComp({servicio: 'getClientesInd.action'}, params);
        }
        
        function agregarActividadSub(params) {
            return subproyecto.agregarActividad({servicio: 'agregarActividad.action'}, params);
        }
        
        function eliminaActividad(params) {
            return subproyecto.eliminarActividad({servicio: 'eliminarActividad.action'}, params);
        }
        
        function modificarActividad(params) {
            return subproyecto.modificaActividad({servicio: 'modificarActividad.action'}, params);
        }
        
        function consultaClientesContrato(params){
        	return reportes.consultaCliContratos({servicio: 'getClientesContrato.action'}, params);
        }
        
        function consultaClientesSContrato(params){
        	return reportes.consultaCliSContratos({servicio: 'getClientesSContrato.action'}, params);
        }
        
        function consultaProyectosCContrato(params){
        	return reportes.consultaProyCContratos({servicio: 'getProyectosCContrato.action'}, params);
        }
        
        function consultaProyectosCAnexo(params){
        	return reportes.consultaProyCAnexo({servicio: 'getProyectosCAnexo.action'}, params);
        }
        
        function consultaProyectosCPoliza(params){
        	return reportes.consultaProyCPoliza({servicio: 'getProyectosCPoliza.action'}, params);
        }
        
        function consultaProyectosSContrato(params){
        	return reportes.consultaProySContratos({servicio: 'getProyectosSContrato.action'}, params);
        }
        
        function consultaProyectosSAnexo(params){
        	return reportes.consultaProySAnexo({servicio: 'getProyectosSAnexo.action'}, params);
        }
        
        function consultaProyectosSPoliza(params){
        	return reportes.consultaProySPoliza({servicio: 'getProyectossSPoliza.action'}, params);
        }
        
        function consultaContratosVigentes(params){
        	return reportes.consultaContrVigentes({servicio: 'getContratosVigentes.action'}, params);
        }
        
        function consultaAreaPlant(params){
        	return plantilla.consultaAreaPlantilla({servicio: 'getAreaPlantilla.action'}, params);
        }
        
        function consultaCostoPlant(params){
        	return plantilla.consultaCostoPlantilla({servicio: 'getPlantillaCostos.action'}, params);
        }
        
        function consultaActividades(params){
        	return subproyecto.consultaActi({servicio: 'consultaActividades.action'}, params);
        }
        
        function consultaPlantillaActividad(params){
        	return plantilla.consultaPlanActi({servicio: 'consultaActividadesPlantilla.action'}, params);
        }
        
        function insertarActividadPlantilla(params){
        	return plantilla.insertarActPlan({servicio: 'insertarActividadPlantilla.action'}, params);
        }
        
        function insertarActPlant(params){
        	return plantilla.insertarActPlanConf({servicio: 'insertarActPlanConflicto.action'}, params);
        }
        
        function eliminarActPlantilla(params){
        	return plantilla.eliminarActPlan({servicio: 'eliminarActividadPlantilla.action'}, params);
        }
        
        function consultaRango(params){
        	return subproyecto.getRango({servicio: 'obtenerRango.action'}, params);
        }
        
        function consultaRecursosSubproyecto(params){
        	return subproyecto.getRecursosSubproyecto({servicio: 'consultaRecursosSubProyecto.action'}, params);
        }
        
    }
})();
