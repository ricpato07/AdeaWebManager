(function() {
	'use strict';

	angular.module('adeaModule').controller('TableroRecurosController',
			TableroRecurosController);

	TableroRecurosController.$inject = [ '$log', 'proyectoServicios',
			'AdeaServicios', 'ticketServicios', 'serviceUrl', 'reporteService', '$filter' ];

	function TableroRecurosController($log, proyectoServicios,
			AdeaServicios, ticketServicios, serviceUrl, reporteService, $filter) {

		var tableroRecursosCtrl = this;
		
		consultaDiasFestivos();
		
		tableroRecursosCtrl.setDate = setDate;
		tableroRecursosCtrl.consultaPlantillaArea = consultaPlantillaArea;
		tableroRecursosCtrl.filtrarActividades = filtrarActividades;
		tableroRecursosCtrl.validaForm = validaForm;
		tableroRecursosCtrl.construyeObjGantt = construyeObjGantt;
		tableroRecursosCtrl.consultaClientes = consultaClientes;
		tableroRecursosCtrl.consultaProyectos = consultaProyectos;
		tableroRecursosCtrl.consultaSubProyectos = consultaSubProyectos;
		tableroRecursosCtrl.setDateActMod = setDateActMod;
		tableroRecursosCtrl.disabled = disabled;
		tableroRecursosCtrl.seleccionaSubproyecto = seleccionaSubproyecto;
		
		tableroRecursosCtrl.filtro = {};
		tableroRecursosCtrl.fechaFin = {abiertoL: false};
		tableroRecursosCtrl.fechaIni = {abierto: false};
		tableroRecursosCtrl.fechaFinActMod = {abierto: false};
		tableroRecursosCtrl.fechaIniActMod = {abierto: false};
		
		
		tableroRecursosCtrl.abrirFechaIni = function () {
			tableroRecursosCtrl.fechaIni.abierto = true;
        };

        tableroRecursosCtrl.abrirFechaFin = function () {
        	tableroRecursosCtrl.fechaFin.abierto = true;
        };
        
        tableroRecursosCtrl.states = [];
		tableroRecursosCtrl.assignableResources = [];
		tableroRecursosCtrl.groups = [];
		tableroRecursosCtrl.items = [];
		tableroRecursosCtrl.bndAdmin = false;
		
		tableroRecursosCtrl.headersFormats = {
	            year: 'YYYY',
	            quarter: '[Q]Q YYYY',
	            month: 'MM/YYYY',
	            week: 'w',
	            day: 'D',
	            hour: 'H',
	            minute: 'H:mm',
	            second: 'H:mm:ss',
	            millisecond: 'H:mm:ss:SSS'
	        };
		
		tableroRecursosCtrl.timeFrames = {
	                day: {
	                    start: moment('8:00', 'HH:mm'),
	                        end: moment('18:00', 'HH:mm'),
	                        working: true, 
	                        default: true 
	                    },
	                noon: {
	                    start: moment('14:00', 'HH:mm'),
	                    end: moment('15:00', 'HH:mm'),
	                    magnet: false, 
	                    working: false, 
	                    default: true 
	                },
	                closed: {
	                    magnet: false, 
	                    working: false, 
	                    color: '#c3dff4', 
	                    classes: ['gantt-closed-timeframe'] 
	                },
	                weekend: {
                        working: false
                    },
                    holiday: {
                        working: false,
                        color: 'red',
                        classes: ['gantt-timeframe-holiday']
                    }
	    };
		
		tableroRecursosCtrl.dateFrames = {

				 holidays: { 
					 evaluator: function (date) {
						var bnd = false;
						angular.forEach(tableroRecursosCtrl.diasFestivos, function (obj1) {
							if(obj1.holiday === date.valueOf()){
								bnd = true;
							}
						 });    
						 return bnd;
                     },
                     targets: ['holiday']
				 },

                weekend: {
                     evaluator: function(date) {
                         return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                     },
                     targets: ['closed'] 
                }
        };
		
		tableroRecursosCtrl.tooltip = 'Asignado a:  {{task.model.nombre}}</br></br> Horas Asignadas: <strong>{{task.model.name}}</strong></br>' +
        '<small>' +
        '<strong>Desde: {{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' Hasta: \' + getToLabel()}}</strong>' +
        '</small>';
		
		tableroRecursosCtrl.formatters = 
				{
                'from': function (from) {
                	 if (from) {
		                    return $filter('fechaSFecha')(from);
		                }
		                return from;
                },
                'to': function (to) {
                	if (to) {
	                    return $filter('fechaSFecha')(to);
	                }
	                return to;
                }
            };		
		
		tableroRecursosCtrl.headersContentTree = '<i class="fa fa-align-justify"></i> {{getHeader()}}';
		
		tableroRecursosCtrl.columnsHeaderContents = {
            'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
            'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
            'to': '<i class="fa fa-calendar"></i> {{getHeader()}}'
        }
		
		function setDateActMod() {
			tableroRecursosCtrl.actividad.fecFin = null;
			tableroRecursosCtrl.fecFinAct = tableroRecursosCtrl.actividad.fecIni;
        }
		
		tableroRecursosCtrl.abrirFechaIniActMod = function () {
			tableroRecursosCtrl.fechaIniActMod.abierto = true;
        };
        
        tableroRecursosCtrl.abrirFechaFinActMod = function () {
        	tableroRecursosCtrl.fechaFinActMod.abierto = true;
        };
		
		activa();
		
		function activa(){
			consultaUsuario();
			// consultaAreasAwm();
		}
		
		
		function disabled(data) {
            var date = data.date,
                mode = data.mode;
            var bndDay = false; 
            
            angular.forEach(tableroRecursosCtrl.diasFestivos, function (obj) {
            	if(data.date.getTime() == obj.holiday){
            		bndDay = true;
            	}
            });


            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) || bndDay ;
        }

		function consultaDiasFestivos(){
			
			var promesaList = AdeaServicios.consultaDiasFestivos().$promise;
			
			promesaList.then(function (respuesta) {

				tableroRecursosCtrl.diasFestivos = respuesta;
			});
	            
			promesaList.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los dias festivos: " + error.data);
			})
			
		}
		
		
		function consultaUsuario() {

	        var promesa = AdeaServicios.consultaUsuario().$promise;
	
	        promesa.then(function (respuesta) {
	        	tableroRecursosCtrl.usuario = respuesta;
	        	consultaEstatusAct();
	        	if(tableroRecursosCtrl.usuario != null){

	        		var bndPermiso = false;
	        		
	        		angular.forEach(tableroRecursosCtrl.usuario.authorities, function (obj1) {	
	        			if(obj1.authority == 'ADEA-WEB-MANAGER-PLANEACION'){
	        				bndPermiso = true;
	        			}
	        		});
	    			
	        		if(!bndPermiso){	        			
	        			consultaPlantilla('U', tableroRecursosCtrl.usuario.username);
	        		}else{
	        			tableroRecursosCtrl.bndAdmin= true;
	        			consultaAreasAwm();
	        		}
	        		
	        	}else{
	        		$location.path('/inicio');
	        	}
	        });
	
	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al consulta el Usuario en Session");
	        });
        }
		 
		function consultaPlantilla(modo, login) {
			$log.info('consultaPlantilla');
			
			var params = {};
			if(modo == 'A'){
				params = {pIdPlantilla: login}; 
			}else{
				params = {login: login}; 
			}
			
	            
			var promesa = proyectoServicios.consultaPlantilla(params).$promise;
	            
			promesa.then(function (respuesta) {

				tableroRecursosCtrl.listPlantilla = respuesta;

				if (tableroRecursosCtrl.listPlantilla.length == 0) {
					AdeaServicios.alerta("error", "No existen Recursos dentro de la Plantilla asociado al login");
				}else{
					tableroRecursosCtrl.resource = { name: tableroRecursosCtrl.listPlantilla[0].nombre };
					if(modo == 'U'){
						tableroRecursosCtrl.filtro.recurso = tableroRecursosCtrl.listPlantilla[0].idPlantilla;
						consultaActividades('U');
					}
				}
			});
	            
			promesa.catch(function (error) {
	               
				AdeaServicios.alerta("error", "Error al consulta rla Plantilla de Personal: " + error.data);
	            
			})
		}
		
		 
		function setDate() {
			if (moment(tableroRecursosCtrl.filtro.fecIni) > moment(tableroRecursosCtrl.filtro.fecFin)) {
				tableroRecursosCtrl.filtro.fecFin = null;
			}
		}
		 
		function consultaEstatusAct() {
			$log.info('consultaEstatusAct');

			var params = {
				keyCatalogo: 'ESTATUS_ACT',
	            scltcod: 2
			};

			var promesa = AdeaServicios.consultaCatalogo(params).$promise;
	            
			promesa.then(function (respuesta) {
				
				tableroRecursosCtrl.estatusActividades = respuesta;
				
				if (tableroRecursosCtrl.estatusActividades.length == 0) {
					AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de Actividades");
				}else{
					construyeEstatus();
					// consultaActividades();
				}
			});

	            
			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta el Catalogo de Actividades: " + error.data);
			})
		}
		
		function construyeEstatus(){

			angular.forEach(tableroRecursosCtrl.estatusActividades, function (obj) {
				var state = {};
				
				state.name = obj.descripcionCat;
				state.areNewItemButtonsHidden = true;
				
				tableroRecursosCtrl.states.push(state);
			});
		}
		
		
		function consultaActividades(modo) {

			if(modo == 'A'){
				tableroRecursosCtrl.assignableResources = [];
				tableroRecursosCtrl.groups = [];
				tableroRecursosCtrl.items = [];
				consultaPlantilla(modo, tableroRecursosCtrl.filtro.recurso);
			}
			
			var fecIni = null;
			var fecFin = null;
			
			if(tableroRecursosCtrl.filtro.fecIni != null && tableroRecursosCtrl.filtro.fecFin != null ){
				fecIni = tableroRecursosCtrl.filtro.fecIni.getTime();
				fecFin = tableroRecursosCtrl.filtro.fecFin.getTime();
			}

			var params = {
					pIdPlantilla: tableroRecursosCtrl.filtro.recurso,
					fecIni: fecIni,
					fecFin: fecFin,
					idArea: tableroRecursosCtrl.filtro.area
			};

			var promesa = reporteService.consultaActividadesRecurso(params).$promise;
	            
			promesa.then(function (respuesta) {

				tableroRecursosCtrl.actividadesRec = respuesta;
				
				if (Object.keys(tableroRecursosCtrl.actividadesRec).length === 0) {
					AdeaServicios.alerta("error", "No existen Actividades asignadas a este recurso");
				}else{
					consultaActividadesLista(params);
					construyeKenban();
				}

			});
			
			promesa.catch(function (error) {
					AdeaServicios.alerta("error", "Error al consulta el Catalogo de Actividades: " + error.data);
				
			});
				
		}
		
		function consultaActividadesLista(params){
			
			var promesaList = reporteService.consultaActRecList(params).$promise;
			
			promesaList.then(function (respuesta) {

				tableroRecursosCtrl.actividadesRecList = respuesta;
				if(tableroRecursosCtrl.actividadesRecList.length == 0){
					AdeaServicios.alerta("error", "La persona Seleccionada no cuenta con actividades Asignadas");
				}else{
					tableroRecursosCtrl.costoGral = 0;
					angular.forEach(tableroRecursosCtrl.actividadesRecList, function (obj1) {	
						tableroRecursosCtrl.costoGral = tableroRecursosCtrl.costoGral + obj1.costoAct;
			    	});
				}
			});
	            
			promesaList.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta lista de Actividades: " + error.data);
			})
			
		}
		
		function construyeKenban(){
			delete tableroRecursosCtrl.actividadesRec.$promise;
			delete tableroRecursosCtrl.actividadesRec.$resolved;
			
			for (var i in tableroRecursosCtrl.actividadesRec) {
				if (tableroRecursosCtrl.actividadesRec.hasOwnProperty(i)) {
					var grupo = { name: tableroRecursosCtrl.actividadesRec[i][0].nombre, state: {name: tableroRecursosCtrl.actividadesRec[i][0].desEstSp, areNewItemButtonsHidden: true}, assignedResource: tableroRecursosCtrl.resource };
					tableroRecursosCtrl.groups.push(grupo);
				    angular.forEach(tableroRecursosCtrl.actividadesRec[i], function (obj) {				 
				    	var estado = null;
				    	var colorBg = '';
				    	var color = '';
				    	angular.forEach(tableroRecursosCtrl.states, function (obj1) {	
				    		if(obj1.name == obj.desEstAct){
				    			estado = obj1;
				    		}
				    	});
				    	
				    	if ((moment(obj.fecFin) > moment() && obj.porcAvance < 100) || moment(obj.fecFin) < moment() && obj.porcAvance == 100) {
				    		colorBg = '#81d80854'; 
				    		color = '#437103f7';
						} 
		            	if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
		            		colorBg = '#f1212154';
		            		color = '#f90202';
						} 
				    	
						tableroRecursosCtrl.items.push( { name: obj.nombreActividad, group: grupo, state: estado, assignedResource: tableroRecursosCtrl.resource, backgroundColor: colorBg, color: color });
				    });

				}
			}
		}
		
		function consultaAreasAwm() {

	            var params = {
	                pIdArea: null
	            };

	            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

	            promesa.then(function (respuesta) {
	            	tableroRecursosCtrl.areasAWM = respuesta;

	                if (tableroRecursosCtrl.areasAWM.length == 0) {
	                    AdeaServicios.alerta("error", "No existen areas registradas");
	                }
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
	            })
	     
		 }
		
		function consultaPlantillaArea(){
        	$log.info("ConsultaPlantilla----")
        	tableroRecursosCtrl.filtro.recurso = null;
        	
        	var params = {
                    idArea: tableroRecursosCtrl.filtro.area
                };

                var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

                promesa.then(function (respuesta) {
                	tableroRecursosCtrl.plantillaArea = respuesta;
                	if (tableroRecursosCtrl.plantillaArea.length == 0) {
                		AdeaServicios.alerta("error", "No existen recursos registrados para el area Seleccionada");
                	}
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
                })
        }
		
		function filtrarActividades(){
			$log.info('filtrarActividades');
			consultaActividades('A');
		}
		
		function validaForm(){
			if(tableroRecursosCtrl.filtro.fecIni != null && tableroRecursosCtrl.filtro.fecIni != undefined && tableroRecursosCtrl.filtro.fecIni != ''){
				if(tableroRecursosCtrl.filtro.fecFin == null || tableroRecursosCtrl.filtro.fecFin == undefined || tableroRecursosCtrl.filtro.fecFin == ''){
					return false;
				}
			}
			
			if(tableroRecursosCtrl.filtro.fecFin != null && tableroRecursosCtrl.filtro.fecFin != undefined && tableroRecursosCtrl.filtro.fecFin != ''){
				if(tableroRecursosCtrl.filtro.fecIni == null || tableroRecursosCtrl.filtro.fecIni == undefined || tableroRecursosCtrl.filtro.fecIni == ''){
					return false;
				}
			}
			
			return true;
		}
		
		function construyeObjGantt(lista){
			
			$log.info('construirGrafica');
        	
        	var actividades = [];
        	
            angular.forEach(lista, function (obj) {
                var actividad = {};
                var tareas = [];
                var tarea = {};
                var subproyecto = {};
                
                var objectS = _.find(actividades, function(o) { 
                	return o.name == obj.nombre; 
                });
                
                if(objectS == null){
                	subproyecto.name = obj.nombre;
                	subproyecto.from =  obj.fecIniAct;
                	subproyecto.to =   obj.fecIniAct;
                	actividades.push(subproyecto);
                }
                
                
                var object = _.find(actividades, function(o) { 
                	return o.id == obj.idActividad; 
                });
                
                if(object == null){
                	actividad.name = obj.nombreActividadRes;
                    actividad.height = '3em';
                    actividad.sortable = false;
                    actividad.from = obj.fecIniAct;
                    actividad.to = obj.fecFinAct;
                    actividad.id = obj.idActividad;
                    actividad.parent = obj.nombre;
                    
                    tarea.name = obj.horasAsig;
                    
                    if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
                        tarea.color = '#fb0808'
                    } else {
                        tarea.color = '#93c47d'
                    }
                    
                    tarea.from = obj.fecIni;
                    tarea.to = obj.fecFin;
                    tarea.id = obj.idActividad;
                    tarea.nombre = obj.recurso;
                   /*
					 * tarea.progress = {} tarea.progress.percent =
					 * obj.porcAvance;
					 * 
					 * if (moment(obj.fecFin) > moment() && obj.porcAvance <
					 * 100) { tarea.progress.color = '#1a4c04'; } else if
					 * (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
					 * tarea.progress.color = '#f39c12'; }
					 */
    				
    				if(obj.predecesora != null && obj.predecesora != undefined){
    					tarea.dependencies = [{from: obj.predecesora}];
    				}
    				
    				tareas.push(tarea);
    				actividad.tasks = tareas;
    				actividades.push(actividad);
                }else{
                	tarea.name = obj.horasAsig;
                    
                    if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
                        tarea.color = '#fb0808'
                    } else {
                        tarea.color = '#93c47d'
                    }
                    
                    tarea.from = obj.fecIni;
                    tarea.to = obj.fecFin;
                    tarea.id = obj.idActividadPlantilla;
                    tarea.nombre = obj.recurso;
                   /*
					 * tarea.progress = {} tarea.progress.percent =
					 * obj.porcAvance;
					 * 
					 * if (moment(obj.fecFin) > moment() && obj.porcAvance <
					 * 100) { tarea.progress.color = '#1a4c04'; } else if
					 * (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
					 * tarea.progress.color = '#f39c12'; }
					 */
    				
    				object.tasks.push(tarea);
                }
                
            });
            
            tableroRecursosCtrl.actividadesGantt = actividades;
			
		}
		
		function consultaClientes() {

            var promesa = proyectoServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {
            	tableroRecursosCtrl.listClientes = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los clientes");
            });
        }
		
		function consultaProyectos() {
			tableroRecursosCtrl.listProyectos = [];
 
            if (AdeaServicios.validarDato(tableroRecursosCtrl.actividad.cliente.idClienteDetalle)) {

                var params = {pidCliente: tableroRecursosCtrl.actividad.cliente.idClienteDetalle};

                var promesa = proyectoServicios.consultaProyecto(params).$promise;

                promesa.then(function (respuesta) {
                	tableroRecursosCtrl.listProyectos = respuesta;


                    if (tableroRecursosCtrl.listProyectos.length == 0) {
                    	tableroRecursosCtrl.subProyectoSeleccionado = null;
                        AdeaServicios.alerta("error", "No existen Proyectos del cliente seleccionado");
                    }
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta de Proyectos: " + error.data.error);
                })
            }
        }
		
		function consultaSubProyectos() {
        	
            if (AdeaServicios.validarDato(tableroRecursosCtrl.actividad.proyecto)) {

                var params = {pidProyecto: tableroRecursosCtrl.actividad.proyecto.idProyecto};

                var promesa = proyectoServicios.consultaSubProyecto(params).$promise;

                promesa.then(function (respuesta) {
                    if (respuesta.length == 0) {
                        AdeaServicios.alerta("error", "No existen SubProyectos del proyecto seleccionado: " + tableroRecursosCtrl.proyecto.nombre);
                        tableroRecursosCtrl.subProyectoSeleccionado = null;
                    } else{
                    	tableroRecursosCtrl.subProyectos = respuesta;
                    }
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los Subproyectos: " + error.data.error);
                })

            }
        }
		
		function seleccionaSubproyecto (){
			tableroRecursosCtrl.fecActIni = moment(tableroRecursosCtrl.actividad.subproyecto.fecIni);
			tableroRecursosCtrl.fecActFin = moment(tableroRecursosCtrl.actividad.subproyecto.fecFin);
			tableroRecursosCtrl.fecActiveIni = new Date(tableroRecursosCtrl.actividad.subproyecto.fecIni);
		}
	}
})();