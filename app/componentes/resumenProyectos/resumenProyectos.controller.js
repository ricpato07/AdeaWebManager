(function() {
	'use strict';

	angular.module('adeaModule').controller('ResumenProyectosController',
			ResumenProyectosController);

	ResumenProyectosController.$inject = [ '$log', 'tblSubProyectos',
			'proyectoServicios', 'AdeaServicios', 'tblProyectoClienteMonto',
			'$filter', '$timeout', 'DTColumnDefBuilder',
			'tblClientesContratos', 'tblClientesCContratos',
			'tblProyectosCContratos', 'tblProyectosCAnexo',
			'tblProyectosCPoliza', 'tblRecursosSubproyecto',
			'tblActividadesPlan', 'reporteService' ];

	function ResumenProyectosController($log, tblSubProyectos,
			proyectoServicios, AdeaServicios, tblProyectoClienteMonto, $filter,
			$timeout, DTColumnDefBuilder, tblClientesContratos,
			tblClientesCContratos, tblProyectosCContratos, tblProyectosCAnexo,
			tblProyectosCPoliza, tblRecursosSubproyecto, tblActividadesPlan, reporteService) {

		var resumenProyectosCtrl = this;
		
		consultaDiasFestivos();
		
		resumenProyectosCtrl.tblProyectoClienteMonto = tblProyectoClienteMonto;
		resumenProyectosCtrl.tblSubProyectos = tblSubProyectos;
		resumenProyectosCtrl.tblRecursosSubproyecto = tblRecursosSubproyecto;
		
		resumenProyectosCtrl.consultaProyectosClientes = consultaProyectosClientes;
		resumenProyectosCtrl.seleccionarProyecto = seleccionarProyecto;
		resumenProyectosCtrl.mostrarDetalleProyecto = mostrarDetalleProyecto;
		resumenProyectosCtrl.filtraSubproyectosEstatus = filtraSubproyectosEstatus;
		resumenProyectosCtrl.filtraSubproyectosTipo = filtraSubproyectosTipo;
		resumenProyectosCtrl.seleccionaSubproyecto = seleccionaSubproyecto;
		resumenProyectosCtrl.construyeObjGantt = construyeObjGantt;
		resumenProyectosCtrl.filtraProyectosTipo = filtraProyectosTipo;
		resumenProyectosCtrl.tblActividadesPlan = tblActividadesPlan;
		resumenProyectosCtrl.cambioActividades = cambioActividades;
		resumenProyectosCtrl.cambioRecursos = cambioRecursos;
		resumenProyectosCtrl.cambioPlaneacion = cambioPlaneacion;
		
		resumenProyectosCtrl.proyectoSeleccionado = {};
		resumenProyectosCtrl.contadorActivos = 0;
		resumenProyectosCtrl.contadorInActivos = 0;
		resumenProyectosCtrl.contadorSubproyectos = 0;
		resumenProyectosCtrl.data = null;
		resumenProyectosCtrl.nombrePro = '';
		resumenProyectosCtrl.indexTabsActive = 0;
		resumenProyectosCtrl.bndActividades = true;
		resumenProyectosCtrl.bndRecursos = false;
		resumenProyectosCtrl.bndPlaneacion = false;
		
		resumenProyectosCtrl.tooltip = '{{task.model.name}} - {{task.model.progress.percent}}%</br>' +
         '<small>' +
         '{{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}' +
         '</small>';


		resumenProyectosCtrl.formatters = {
         'model.from': function (value, column, row) {
             if (value) {
                 return $filter('fechaSFecha')(value);
             }
             return value;
         },
         'model.to': function (value, column, row) {
             if (value) {
                 return $filter('fechaSFecha')(value);
             }
             return value;
         }
		};

		resumenProyectosCtrl.headersLabels = {
         year: 'Año',
         quarter: 'Quarter',
         month: 'Mes',
         week: 'Semana',
         day: 'Dia',
         hour: 'Hora',
         minute: 'Minuto'
		};

		resumenProyectosCtrl.headersFormats = {
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
		
		resumenProyectosCtrl.timeFrames = {
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
        
        
		resumenProyectosCtrl.dateFrames = {
                
				holidays: { 
					 evaluator: function (date) {
						var bnd = false;
						angular.forEach(resumenProyectosCtrl.diasFestivos, function (obj1) {
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
		
			resumenProyectosCtrl.dtColumnDefsAct = [
	        	DTColumnDefBuilder.newColumnDef(0).notSortable(),
	            DTColumnDefBuilder.newColumnDef(1).notSortable(),
	            DTColumnDefBuilder.newColumnDef(2).notSortable(),
	            DTColumnDefBuilder.newColumnDef(3).notSortable(),
	            DTColumnDefBuilder.newColumnDef(4).notSortable(),
	            DTColumnDefBuilder.newColumnDef(5).notSortable(),
	            DTColumnDefBuilder.newColumnDef(6).notSortable(),
	            DTColumnDefBuilder.newColumnDef(7).notSortable()
	        ];
	        


		activar();

		function activar() {
			$log.info('Activa el controlador ReporteContratosController');
			consultaClientes();
		}
		
		function consultaDiasFestivos(){
			
			var promesaList = AdeaServicios.consultaDiasFestivos().$promise;
			
			promesaList.then(function (respuesta) {

				resumenProyectosCtrl.diasFestivos = respuesta;
			});
	            
			promesaList.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los dias festivos: " + error.data);
			})
			
		}
		
		function consultaClientes() {

			var promesa = proyectoServicios.consultaClientes().$promise;

			promesa.then(function (respuesta) {
				resumenProyectosCtrl.listClientes = respuesta;
				
				if(resumenProyectosCtrl.listClientes.length > 0){
					resumenProyectosCtrl.clienteSeleccionado = resumenProyectosCtrl.listClientes[0];
					consultaProyectosClientes();
				}else{
					AdeaServicios.alerta("error", "No existen Clientes para consultar");
				}
			});

			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los clientes");
			});
	    }
		
		function consultaProyectosClientes() {
			$log.info('--consultaProyectosClientes---');
			
			resumenProyectosCtrl.contadorActivos = 0;
			resumenProyectosCtrl.contadorInActivos = 0;
			resumenProyectosCtrl.contadorSubproyectos = 0;
			
			var params = {
					pIdCliente: resumenProyectosCtrl.clienteSeleccionado.idClienteDetalle
			}

			var promesa = reporteService.consultaProyectoClienteMonto(params).$promise;

			promesa.then(function (respuesta) {
				resumenProyectosCtrl.listProyectos = respuesta;
				
				
				if(resumenProyectosCtrl.listProyectos.length == 0){
					AdeaServicios.alerta("error", "El Cliente Seleccionado no cuenta con Proyectos");
				}else{
					   
	                angular.forEach(resumenProyectosCtrl.listProyectos, function (obj) {
	                	if(obj.estatus == 'A'){
	                		resumenProyectosCtrl.contadorActivos = resumenProyectosCtrl.contadorActivos + 1;
	                	}else{
	                		resumenProyectosCtrl.contadorInActivos = resumenProyectosCtrl.contadorInActivos + 1;
	                	}
	                	
	                	resumenProyectosCtrl.contadorSubproyectos = resumenProyectosCtrl.contadorSubproyectos + obj.noSubproyectos;
	                	
	                	mostrarDetalleProyecto(true);
	                });
	                
	                resumenProyectosCtrl.proyectosEditable = angular.copy(resumenProyectosCtrl.listProyectos);
				}
			});

			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los clientes");
			});
	    }
		
		function seleccionarProyecto(reg){
			resumenProyectosCtrl.proyectoSeleccionado = angular.copy(reg);
			
			consultaSubProyectos();
		}
		
		function mostrarDetalleProyecto(valor) {
			$log.info("Entra al metodo mostrarDetalleRegistro() del Controlador ClientesController");
	            
			resumenProyectosCtrl.mostrarDetalleProy(valor);
	    }
		
		
		function consultaSubProyectos() {
			$log.info('Subproyectos');
			
			resumenProyectosCtrl.indicadoresSubProyecto = {
					activos: 0,
					qa: 0,
					proceso: 0,
					suspendido: 0,
					facturable: 0,
					nofacturable: 0
			};

			var params = {pidProyecto: resumenProyectosCtrl.proyectoSeleccionado.idProyecto};

			var promesa = proyectoServicios.consultaSubProyecto(params).$promise;

			promesa.then(function (respuesta) {
				resumenProyectosCtrl.subProyectos = respuesta;

				if (resumenProyectosCtrl.subProyectos.length == 0) {
					AdeaServicios.alerta("error", "No existen SubProyectos del proyecto seleccionado: " + resumenProyectosCtrl.proyectoSeleccionado.nombre);
					resumenProyectosCtrl.subProyectoSeleccionado = null;
					mostrarDetalleProyecto(true);
				} else{
					 resumenProyectosCtrl.subProyectosEditable = angular.copy(resumenProyectosCtrl.subProyectos);
					 resumenProyectosCtrl.costosProy = 0;
					 resumenProyectosCtrl.presupuestoCostosProy = 0;
					 angular.forEach(resumenProyectosCtrl.subProyectos, function (obj) {
		                	if(obj.estatus == 'A'){
		                		resumenProyectosCtrl.indicadoresSubProyecto.activos = resumenProyectosCtrl.indicadoresSubProyecto.activos + 1;
		                	}
		                	
		                	if(obj.estatus == 'QA'){
		                		resumenProyectosCtrl.indicadoresSubProyecto.qa = resumenProyectosCtrl.indicadoresSubProyecto.qa + 1;
		                	}
		                	
		                	if(obj.estatus == 'P'){
		                		resumenProyectosCtrl.indicadoresSubProyecto.proceso = resumenProyectosCtrl.indicadoresSubProyecto.proceso + 1;
		                	}
		                	
		                	if(obj.estatus == 'S'){
		                		resumenProyectosCtrl.indicadoresSubProyecto.suspendido = resumenProyectosCtrl.indicadoresSubProyecto.suspendido + 1;
		                	}
		                	
		                	if(obj.catFacturable == "1"){
		                		resumenProyectosCtrl.indicadoresSubProyecto.facturable = resumenProyectosCtrl.indicadoresSubProyecto.facturable + 1;
		                	}else{
		                		resumenProyectosCtrl.indicadoresSubProyecto.nofacturable = resumenProyectosCtrl.indicadoresSubProyecto.nofacturable + 1;
		                	}
		                	
		                	 resumenProyectosCtrl.costosProy =  resumenProyectosCtrl.costosProy + obj.costo;
		                	 resumenProyectosCtrl.presupuestoCostosProy = resumenProyectosCtrl.presupuestoCostosProy + obj.presupuesto;
		                });
					
					mostrarDetalleProyecto(false);
				}
			});

			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los Subproyectos: " + error.data.error);
			})

		}
		
		
		function filtraSubproyectosEstatus(estatus, nombre){

			resumenProyectosCtrl.subProyectosEditable = resumenProyectosCtrl.subProyectos;
			
			 var filtro = _.filter(resumenProyectosCtrl.subProyectos, function (act) {

	                return act.estatus === estatus;
	         });
			 
			 resumenProyectosCtrl.subProyectosEditable = filtro;
			 resumenProyectosCtrl.nombrePro = nombre;
			 resumenProyectosCtrl.indexTabsActive = 0;
		}
		
		function filtraSubproyectosTipo(tipo, nombre){
			
			resumenProyectosCtrl.subProyectosEditable = resumenProyectosCtrl.subProyectos;
			
			 var filtro = _.filter(resumenProyectosCtrl.subProyectos, function (act) {
				 	if(tipo == 1){
				 		return act.catFacturable === tipo;
				 	}else{
				 		return act.catFacturable != 1;
				 	}
	         });
			 
			 resumenProyectosCtrl.subProyectosEditable = filtro;
			 resumenProyectosCtrl.nombrePro = nombre;
			 resumenProyectosCtrl.indexTabsActive = 0;
		}
		
		function filtraProyectosTipo(tipo){
			
			 var filtro = _.filter(resumenProyectosCtrl.listProyectos, function (act) {
				 		return act.estatus === tipo;
	         });
			 
			 resumenProyectosCtrl.proyectosEditable = filtro;
			 mostrarDetalleProyecto(true);

		}
		
		function seleccionaSubproyecto(reg){
			$log.info('seleccionaSubproyecto');
			resumenProyectosCtrl.subProyectoSeleccionado =  angular.copy(reg);
			consultaActividadesProy();
			
			$timeout(function(){
				if(resumenProyectosCtrl.listActividadesSubProy.length > 0){
					resumenProyectosCtrl.bndActividades = true;
					resumenProyectosCtrl.bndPlaneacion = false;
					resumenProyectosCtrl.bndRecursos = false;
					angular.element('#mdlSubProyecto').modal('show');      
					
				}else{
					AdeaServicios.alerta("error", "El subproyecto no cuenta con ninguna actividad Planeada");
				}
			 }, 1000);
						  					
		}
		
		function construyeObjGantt(listaSubProy) {
			$log.info('construye Gantt');
            var subProyectos = [];
            angular.forEach(listaSubProy, function (obj) {
                var subProyecto = {};

                subProyecto.name = obj.nombre;
                subProyecto.height = '3em';
                subProyecto.sortable = false;
                subProyecto.from = obj.fecIni;
                subProyecto.to = obj.fecFin;

                var tareas = [];
                
                var tarea = {};

                tarea.name = obj.nombre;
                
                if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
                    tarea.color = '#fb0808'
                } else {
                    tarea.color = '#93c47d'
                }
                
                tarea.from = obj.fecIni;
                tarea.to = obj.fecFin;
                tareas.push(tarea);

                subProyecto.tasks = tareas;
                subProyectos.push(subProyecto);
            });

            resumenProyectosCtrl.data =  subProyectos;
        }
		
		
		function consultaActividadesProy() {
        	$log.info('consultaActividadesProy');
        	
        	
        	var params = {pIdSubProyecto: resumenProyectosCtrl.subProyectoSeleccionado.idSubproyecto};

            var promesa = proyectoServicios.consultaActividades(params).$promise;

            promesa.then(function (respuesta) {
            		
            	resumenProyectosCtrl.listActividadesSubProy = respuesta;
            	resumenProyectosCtrl.listActividadesSubProy = $filter('ordenarListMilis')(resumenProyectosCtrl.listActividadesSubProy);
            	
            	resumenProyectosCtrl.porcentajeTotal = 0;
            	
            	
            	angular.forEach(resumenProyectosCtrl.listActividadesSubProy, function (obj) { 
            		resumenProyectosCtrl.porcentajeTotal = resumenProyectosCtrl.porcentajeTotal + obj.porcAvance;
            	});
            	
            	resumenProyectosCtrl.porcentajeP = resumenProyectosCtrl.porcentajeTotal / resumenProyectosCtrl.listActividadesSubProy.length;

            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta de Áreas: " + error.data);
            })
        }
		
		function cambioActividades(){
			resumenProyectosCtrl.bndActividades = true;
			resumenProyectosCtrl.bndRecursos = false;
			resumenProyectosCtrl.bndPlaneacion =false;
		}
		
		function cambioRecursos(){
			consultaRecursosSubproyecto();
			resumenProyectosCtrl.bndActividades = false;
			resumenProyectosCtrl.bndRecursos = true;
			resumenProyectosCtrl.bndPlaneacion =false;
			
		}
		
		function cambioPlaneacion(){
			resumenProyectosCtrl.actvidadesGantt = construirGrafica(resumenProyectosCtrl.listActividadesSubProy);
			resumenProyectosCtrl.bndActividades = false;
			resumenProyectosCtrl.bndRecursos = false;
			resumenProyectosCtrl.bndPlaneacion = true;
		}
		
		
		function consultaRecursosSubproyecto(){
	        	
			var params = {
	        		pIdSubproyecto: resumenProyectosCtrl.subProyectoSeleccionado.idSubproyecto
			};
				
			var promesa = proyectoServicios.consultaRecursosSubproyecto(params).$promise;
				
			promesa.then(function (respuesta) {
				resumenProyectosCtrl.recursosSubproyecto = respuesta
			});
				
			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error obtener las personas Asignadas al Subproyecto: " + error.data);
			});
	        	
	    }
		
		
		function construirGrafica(lista){
        	$log.info('construirGrafica');
        	
        	var actividades = [];
            angular.forEach(lista, function (obj) {
                var actividad = {};
                var tareas = [];
                var tarea = {};
                
                actividad.name = obj.nombreActividad;
                actividad.height = '3em';
                actividad.sortable = false;
                actividad.from = obj.fecIni;
                actividad.to = obj.fecFin;

                tarea.name = obj.nombreActividad;
                
                if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
                    tarea.color = '#fb0808'
                } else {
                    tarea.color = '#93c47d'
                }
                
                tarea.from = obj.fecIni;
                tarea.to = obj.fecFin;
                tarea.id = obj.idActividad;
                tarea.progress = {}
				tarea.progress.percent = obj.porcAvance;
				  
				if (moment(obj.fecFin) > moment() && obj.porcAvance < 100) {
					tarea.progress.color = '#1a4c04'; 
				} else if (moment(obj.fecFin) < moment() && obj.porcAvance < 100) {
				    tarea.progress.color = '#f39c12'; 
				}		
				
				if(obj.predecesora != null && obj.predecesora != undefined){
					tarea.dependencies = [{from: obj.predecesora}];
				}
				
				
                tareas.push(tarea);


                actividad.tasks = tareas;
                actividades.push(actividad);
            });
            
            return actividades;
        }
	}
})();