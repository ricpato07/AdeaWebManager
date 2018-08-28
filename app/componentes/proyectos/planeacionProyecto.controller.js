(function () {
    'use strict';

    angular
        .module('adeaModule')
        .controller('PlaneacionProyectoController', PlaneacionProyectoController);

    PlaneacionProyectoController.$inject = ['$log', '$q', 'tblSubProyectos', 'proyectoServicios', 'AdeaServicios', 'tblActividadesPlan', '$filter', '$timeout', 'DTColumnDefBuilder', 'tblReprogramacion', '$location', 'tblRecursosSubproyecto'];

    function PlaneacionProyectoController($log, $q, tblSubProyectos, proyectoServicios, AdeaServicios, tblActividadesPlan, $filter, $timeout, DTColumnDefBuilder, tblReprogramacion, $location, tblRecursosSubproyecto) {

        var planeacionProyectoCtrl = this;
        
        // moment configuracion
        moment.locale('es', {
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4 // The week that contains Jan 4th is the first week of
						// the year.
            }
        });
        
        consultaDiasFestivos();
        // Declaracion de Objetos Tabla
        planeacionProyectoCtrl.tblSubProyectos = tblSubProyectos;
        planeacionProyectoCtrl.tblReprogramacion = tblReprogramacion;
        planeacionProyectoCtrl.tblActividadesPlan = tblActividadesPlan;
        planeacionProyectoCtrl.tblRecursosSubproyecto = tblRecursosSubproyecto;
        
        // Declaracion de Funciones
        planeacionProyectoCtrl.consultaProyectos = consultaProyectos;
        planeacionProyectoCtrl.consultaSubProyectos = consultaSubProyectos;
        planeacionProyectoCtrl.guardarSubproyecto = guardarSubproyecto;
        planeacionProyectoCtrl.cambioModo = cambioModo;
        planeacionProyectoCtrl.setDate = setDate;
        planeacionProyectoCtrl.seleccionarSubProyecto = seleccionarSubProyecto;
        planeacionProyectoCtrl.noHaCambiadoSubProy = noHaCambiadoSubProy;
        planeacionProyectoCtrl.modificarSubproyecto = modificarSubproyecto;
        planeacionProyectoCtrl.consultaProyectosCtrl = consultaProyectosCtrl;
        planeacionProyectoCtrl.setDateAct = setDateAct
        planeacionProyectoCtrl.planearActividad = planearActividad;
        planeacionProyectoCtrl.modificaFecha = modificaFecha;
        planeacionProyectoCtrl.disabled = disabled;
        planeacionProyectoCtrl.addActividad = addActividad;
        planeacionProyectoCtrl.seleccionarActividad = seleccionarActividad;
        planeacionProyectoCtrl.delActividad = delActividad;
        planeacionProyectoCtrl.editActividad = editActividad;
        planeacionProyectoCtrl.addActividadMod = addActividadMod;
        planeacionProyectoCtrl.setDateActMod = setDateActMod;
        planeacionProyectoCtrl.planearActividadMod = planearActividadMod;
        planeacionProyectoCtrl.setModeEliminar = setModeEliminar;
        planeacionProyectoCtrl.setModeEditar = setModeEditar
        planeacionProyectoCtrl.setDateMod = setDateMod;
        planeacionProyectoCtrl.setDateFin = setDateFin;
        planeacionProyectoCtrl.setDateFinMod = setDateFinMod;
        planeacionProyectoCtrl.modificaFechaFin = modificaFechaFin;
        planeacionProyectoCtrl.noHaCambiadoActividad = noHaCambiadoActividad;
        planeacionProyectoCtrl.setFechasActividadesMdo = setFechasActividadesMdo;
        planeacionProyectoCtrl.consultaAreasAwm = consultaAreasAwm;
        planeacionProyectoCtrl.consultaPlantillaArea = consultaPlantillaArea;
        planeacionProyectoCtrl.construirGrafica = construirGrafica;
        planeacionProyectoCtrl.modificacionActividad = modificacionActividad;
        planeacionProyectoCtrl.construyeObjGantt = construyeObjGantt;
        planeacionProyectoCtrl.regresar = regresar;
        planeacionProyectoCtrl.obtenerArea = obtenerArea;
        planeacionProyectoCtrl.seleccionActividades = seleccionActividades;
        planeacionProyectoCtrl.consultaActividadesProy = consultaActividadesProy;
        planeacionProyectoCtrl.registrarActividades = registrarActividades;
        planeacionProyectoCtrl.asignarRecurso = asignarRecurso;
        planeacionProyectoCtrl.graficaGantActividades = graficaGantActividades;
        planeacionProyectoCtrl.guardarAsignacion = guardarAsignacion;
        planeacionProyectoCtrl.changeDateAct = changeDateAct;
        planeacionProyectoCtrl.changeFecSub = changeFecSub;
        planeacionProyectoCtrl.guardarConflicto = guardarConflicto;
        planeacionProyectoCtrl.eliminarPlan = eliminarPlan;
        planeacionProyectoCtrl.seleccionarEliminacion = seleccionarEliminacion;
        planeacionProyectoCtrl.graficaGantTraslapes = graficaGantTraslapes;
        planeacionProyectoCtrl.validaRangos = validaRangos;
        planeacionProyectoCtrl.seleccionRecursos = seleccionRecursos;
        
        // Inicializacion de Variables
        planeacionProyectoCtrl.subProyecto = {};
        planeacionProyectoCtrl.subProyecto.awmSubproyectoActs = [];
        planeacionProyectoCtrl.subProyecto.awmTicket = {};
        planeacionProyectoCtrl.cliente = null;
        planeacionProyectoCtrl.proyecto = null;
        planeacionProyectoCtrl.modoVista = 'C';
        planeacionProyectoCtrl.listActividadPlan = [];
        planeacionProyectoCtrl.actividad = {};
        planeacionProyectoCtrl.mostrarPlaneacion = false;
        planeacionProyectoCtrl.mostrarSubProyectos = false;
        planeacionProyectoCtrl.mostrarActividades = false;
        planeacionProyectoCtrl.awmTicket = null;
        planeacionProyectoCtrl.modeEliminarAct = 'A';
        planeacionProyectoCtrl.modeEditarAct = 'A';
        planeacionProyectoCtrl.indexTabActive = 0;
        planeacionProyectoCtrl.reprogramacion = {};
        planeacionProyectoCtrl.fechaFin = {abiertoL: false};
        planeacionProyectoCtrl.fechaIni = {abierto: false};
        planeacionProyectoCtrl.fechaFinAct = {abierto: false};
        planeacionProyectoCtrl.fechaIniAct = {abierto: false};
        planeacionProyectoCtrl.fechaFinActMod = {abierto: false};
        planeacionProyectoCtrl.fechaIniActMod = {abierto: false};
        planeacionProyectoCtrl.fechaIniActRec = {abierto: false};
        planeacionProyectoCtrl.fechaFinActRec = {abierto: false};
        planeacionProyectoCtrl.bndGant = false;
        var promesaSel = null;
        
        // Inicializacion de Objetos para Fecha
        planeacionProyectoCtrl.abrirFechaFin = function () {
            planeacionProyectoCtrl.fechaFin.abiertoL = true;
        }

        planeacionProyectoCtrl.abrirFechaFinA = function () {
            planeacionProyectoCtrl.fechaFin.abiertoLA = true;
            planeacionProyectoCtrl.fechaFinResp = planeacionProyectoCtrl.subProyecto.fecFin;
        };

        planeacionProyectoCtrl.abrirFechaIni = function () {
            planeacionProyectoCtrl.fechaIni.abierto = true;
            planeacionProyectoCtrl.fechaIniResp = planeacionProyectoCtrl.subProyecto.fecIni;
        };

        planeacionProyectoCtrl.abrirFechaFinAct = function () {
            planeacionProyectoCtrl.fechaFinAct.abierto = true;
        };

        planeacionProyectoCtrl.abrirFechaIniAct = function () {
            planeacionProyectoCtrl.fechaIniAct.abierto = true;
        }

        planeacionProyectoCtrl.abrirFechaFinActMod = function () {
            planeacionProyectoCtrl.fechaFinActMod.abierto = true;
        };

        planeacionProyectoCtrl.abrirFechaIniActMod = function () {
            planeacionProyectoCtrl.fechaIniActMod.abierto = true;
        };
        
        planeacionProyectoCtrl.abrirFechaFinActRec = function () {
            planeacionProyectoCtrl.fechaFinActRec.abierto = true;
        };

        planeacionProyectoCtrl.abrirFechaIniActRec = function () {
            planeacionProyectoCtrl.fechaIniActRec.abierto = true;
        };

        planeacionProyectoCtrl.tooltip = '{{task.model.name}} - {{task.model.progress.percent}}%</br>' +
            '<small>' +
            '{{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}' +
            '</small>';


        planeacionProyectoCtrl.formatters = {
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

        planeacionProyectoCtrl.headersLabels = {
            year: 'Año',
            quarter: 'Quarter',
            month: 'Mes',
            week: 'Semana',
            day: 'Dia',
            hour: 'Hora',
            minute: 'Minuto'
        };

        planeacionProyectoCtrl.headersFormats = {
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

        planeacionProyectoCtrl.dtColumnDefsAct = [
        	DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
            DTColumnDefBuilder.newColumnDef(6).notSortable(),
            DTColumnDefBuilder.newColumnDef(7).notSortable()
        ];
        
        planeacionProyectoCtrl.timeFrames = {
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
        
        
        planeacionProyectoCtrl.dateFrames = {
                
        		holidays: { 
					 evaluator: function (date) {
						var bnd = false;
						angular.forEach(planeacionProyectoCtrl.diasFestivos, function (obj1) {
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
        
        planeacionProyectoCtrl.labelsMultiselect = {
        	    "itemsSelected": "Recursos Seleccionados",
        	    "selectAll": "Seleccionar Todos",
        	    "unselectAll": "Borrar Todos",
        	    "search": "Buscar",
        	    "select": "Seleccione"
        	}

        activa();

        function activa() {
            $log.info('Activacontrolador');

            consultaUsuario();
        }
        

		function consultaDiasFestivos(){
			
			var promesaList = AdeaServicios.consultaDiasFestivos().$promise;
			
			promesaList.then(function (respuesta) {

				planeacionProyectoCtrl.diasFestivos = respuesta;
			});
	            
			promesaList.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta los dias festivos: " + error.data);
			})
			
		}
        
        function consultaUsuario() {

	        var promesa = AdeaServicios.consultaUsuario().$promise;
	
	        promesa.then(function (respuesta) {
	        	planeacionProyectoCtrl.usuario = respuesta;
	        	
	        	$log.info('usuario');
	        	$log.info(planeacionProyectoCtrl.usuario);
	        	if(planeacionProyectoCtrl.usuario != null){
			        consultaClientes();
		            consultaPlantilla();
		            //consultaTickets();
		            consultaEstatus();
		            consultaAreas();
		            consultaTipoProyecto();
	        	}else{
	        		  $location.path('/inicio');
	        	}
	        });
	
	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al consulta el Usuario en Session");
	        });
        }

        function consultaClientes() {

            var promesa = proyectoServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {
                planeacionProyectoCtrl.listClientes = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los clientes");
            });
        }

        function consultaProyectos() {
            planeacionProyectoCtrl.listProyectos = [];
            planeacionProyectoCtrl.subProyectos = [];
            if (AdeaServicios.validarDato(planeacionProyectoCtrl.cliente)) {

                var params = {pidCliente: planeacionProyectoCtrl.cliente.idClienteDetalle};

                var promesa = proyectoServicios.consultaProyecto(params).$promise;

                promesa.then(function (respuesta) {
                    planeacionProyectoCtrl.listProyectos = respuesta;


                    if (planeacionProyectoCtrl.listProyectos.length == 0) {
                        planeacionProyectoCtrl.subProyectoSeleccionado = null;
                        AdeaServicios.alerta("error", "No existen Proyectos del cliente seleccionado");
                    }
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta de Proyectos: " + error.data.error);
                })
            }
        }

        function consultaSubProyectos() {

            if (AdeaServicios.validarDato(planeacionProyectoCtrl.proyecto)) {

                var params = {pidProyecto: planeacionProyectoCtrl.proyecto.idProyecto};

                var promesa = proyectoServicios.consultaSubProyecto(params).$promise;

                promesa.then(function (respuesta) {
                    planeacionProyectoCtrl.subProyectos = respuesta;

                    if (planeacionProyectoCtrl.subProyectos.length == 0) {
                        AdeaServicios.alerta("error", "No existen SubProyectos del proyecto seleccionado: " + planeacionProyectoCtrl.proyecto.nombre);
                        planeacionProyectoCtrl.subProyectoSeleccionado = null;
                    } 
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los Subproyectos: " + error.data.error);
                })

            }

        }

        function cambioModo(bnd) {
            $log.info('cambioModo');
            planeacionProyectoCtrl.modoVista = bnd;
            planeacionProyectoCtrl.listActividades = [];
            planeacionProyectoCtrl.actividadSeleccionada = null;
            planeacionProyectoCtrl.actividadEditable = null;
            if (planeacionProyectoCtrl.modoVista == 'A') {
                planeacionProyectoCtrl.subProyecto = {};
                planeacionProyectoCtrl.subProyecto.idTicket = planeacionProyectoCtrl.proyecto.idTicket;
                planeacionProyectoCtrl.listProyCtrl = [];
                planeacionProyectoCtrl.idArea = null;
                planeacionProyectoCtrl.subProyectoSeleccionado = null;
                consultaAreasAwm();
            } else if (planeacionProyectoCtrl.modoVista == 'M'){
            	
                planeacionProyectoCtrl.fecActIni = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                planeacionProyectoCtrl.fecActFin = moment(planeacionProyectoCtrl.subproyectoEditable.fecFin);
                consultaAreasAwm();
            } else if (planeacionProyectoCtrl.modoVista == 'P'){
            	planeacionProyectoCtrl.fecActiveIni = new Date(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                planeacionProyectoCtrl.actividad.idTicket = planeacionProyectoCtrl.subProyectoSeleccionado.idTicket;
                planeacionProyectoCtrl.fecActIni = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                planeacionProyectoCtrl.fecActFin = moment(planeacionProyectoCtrl.subproyectoEditable.fecFin);
                planeacionProyectoCtrl.indexTabActive = 0;
                planeacionProyectoCtrl.mostrarActividades = false;
                consultaTecnologias();
                planeacionProyectoCtrl.listActividadesSub = null;
            } else if(planeacionProyectoCtrl.modoVista == 'C'){
            	planeacionProyectoCtrl.consultaSubProyectos();
            	planeacionProyectoCtrl.subProyectoSeleccionado = null;
            }
        }


        function consultaPlantilla() {

            var params = {pIdPerfil: '11', estatus: 'A'};

            var promesa = proyectoServicios.consultaPlantilla(params).$promise;

            promesa.then(function (respuesta) {

                planeacionProyectoCtrl.listPlantillaLider = respuesta;


                if (planeacionProyectoCtrl.listPlantillaLider.length == 0) {
                    AdeaServicios.alerta("error", "No existen Recursos dentro de la Plantilla de Personal que tengan perfil de Lider");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta la Plantilla de Personal: " + error.data);
            })

        }

        function setDate() {
            if (planeacionProyectoCtrl.listActividadPlan.length > 0) {
                planeacionProyectoCtrl.modificaFecIniSub = 'A';
                angular.element('#cambiaFecha').modal('show');
            } else {
                planeacionProyectoCtrl.subProyecto.fecFin = null;
            }
        }

        function setDateMod() {
            if (planeacionProyectoCtrl.listActividadesSubProy.length > 0) {
                planeacionProyectoCtrl.modificaFecIniSub = 'M';
                angular.element('#cambiaFecha').modal('show');
            } else {
                planeacionProyectoCtrl.fecIniModAct = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                planeacionProyectoCtrl.subproyectoEditable.fecFin = null;
            }
        }


        function setDateFin() {
            if (planeacionProyectoCtrl.listActividadPlan.length > 0) {
                planeacionProyectoCtrl.modificaFecFinSub = 'A';
                angular.element('#cambiaFechaFin').modal('show');
            }
        }

        function setDateFinMod() {
            if (planeacionProyectoCtrl.listActividadesSubProy.length > 0) {
                planeacionProyectoCtrl.modificaFecFinSub = 'M';
                angular.element('#cambiaFechaFin').modal('show');
            }
        }


        function setDateAct() {
        	$log.info('SetDateAct');
        	
        	if(moment(planeacionProyectoCtrl.actividad.fecFin) != null && moment(planeacionProyectoCtrl.actividad.fecFin) < planeacionProyectoCtrl.actividad.fecIni){
        		 planeacionProyectoCtrl.actividad.fecFin = null;
        	}
           
            consultaActividadesProy('A');
            
        }

        function setDateActMod() {
            planeacionProyectoCtrl.actividadEditable.fecFin = null;
            planeacionProyectoCtrl.fecFinAct = planeacionProyectoCtrl.actividadEditable.fecIni;
        }

        function guardarSubproyecto() {

            $log.info('guardarSubproyecto');

            planeacionProyectoCtrl.awmAreas = [];

            angular.forEach(planeacionProyectoCtrl.subProyecto.areas, function (obj) {
                delete obj.nombre;
                delete obj.fecRegistro;
            });

            planeacionProyectoCtrl.subProyecto.idProyecto = planeacionProyectoCtrl.proyecto.idProyecto;
            planeacionProyectoCtrl.subProyecto.nombre = planeacionProyectoCtrl.subProyecto.nombre.toUpperCase();
            // planeacionProyectoCtrl.subProyecto.areas =
			// planeacionProyectoCtrl.awmAreas;

            var promesa = proyectoServicios.agregarSubproyecto(planeacionProyectoCtrl.subProyecto).$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);

                if (respuesta.error == 'ok') {
                    consultaSubProyectos();
                    consultaAreasAwm();
                    planeacionProyectoCtrl.modoVista = 'C';
                    planeacionProyectoCtrl.subProyecto = null;
                    AdeaServicios.alerta("success", "Se registro el SubProyecto de manera Satisfactoria");
                } else {
                    AdeaServicios.alerta("error", respuesta.error);
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al registrar un Subproyecto: " + error.data);
            })
        }

        function seleccionarSubProyecto(reg) {
            $log.info('Selecciona Subproyecto');
            planeacionProyectoCtrl.subproyectoEditable = {};
            planeacionProyectoCtrl.subProyectoSeleccionado = reg;
            angular.copy(reg, planeacionProyectoCtrl.subproyectoEditable);
            // planeacionProyectoCtrl.listProyCtrl =
            consultaActividadesProy('N');
            consultaRecursosSubproyecto();
            planeacionProyectoCtrl.fecIniSubProy = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
            angular.forEach(planeacionProyectoCtrl.subproyectoEditable.areas, function (areaAWM) {
            	$log.info('areas');
            	$log.info(areaAWM);
                delete areaAWM.idSubproyectoArea;
                delete areaAWM.idSubproyecto;
                delete areaAWM.descSubproyecto;
                areaAWM.nombre = areaAWM.descArea;
                delete areaAWM.descArea;
            })

        }

        function noHaCambiadoSubProy() {
            var bndCambio = false;

            if (!angular.equals(planeacionProyectoCtrl.subProyectoSeleccionado, planeacionProyectoCtrl.subproyectoEditable)) {
                bndCambio = true;
            }

            return bndCambio;
        }

        function modificarSubproyecto() {
        	
        	var fecFinUltimaAct = planeacionProyectoCtrl.listActividadesSubProy[planeacionProyectoCtrl.listActividadesSubProy.length - 1].fecFin;
        	var dateFin = new Date(fecFinUltimaAct);
        	dateFin.setHours(0,0,0,0);
        	
        	var fecIniPrimerAct = planeacionProyectoCtrl.listActividadesSubProy[0].fecIni;
        	var dateIni = new Date(fecIniPrimerAct);
        	dateIni.setHours(0,0,0,0);
        	
        	$log.info(dateFin);
        	$log.info(planeacionProyectoCtrl.subproyectoEditable.fecFin);
        	
        	if(planeacionProyectoCtrl.subproyectoEditable.fecIni > dateIni.getTime() || planeacionProyectoCtrl.subproyectoEditable.fecFin < dateFin.getTime()){
        		 AdeaServicios.alerta("error", "La fecha de Finalización del Subproyecto no es valida ya que hay actividades planeadas para esas fechas");
        	}else{
        		planeacionProyectoCtrl.subProyectoMod = {};

                if (planeacionProyectoCtrl.awmTicket != null) {
                    planeacionProyectoCtrl.subproyectoEditable.idTicket = planeacionProyectoCtrl.awmTicket.idTicket;
                }

                delete planeacionProyectoCtrl.subproyectoEditable.descTicket;


               angular.forEach(planeacionProyectoCtrl.subproyectoEditable.areas, function (obj) {
                    delete obj.nombre;
                    delete obj.fecRegistro;
                });

                var promesa = proyectoServicios.editarSubProyecto(planeacionProyectoCtrl.subproyectoEditable).$promise;

                promesa.then(function (respuesta) {
                	
                	if (respuesta.error == 'ok') {
                		 consultaSubProyectos();
                         consultaAreasAwm();
                         planeacionProyectoCtrl.modoVista = 'C';
                         AdeaServicios.alerta("success", "Se registro el SubProyecto de manera Satisfactoria");
                         planeacionProyectoCtrl.actividadSeleccionada = null;
                         planeacionProyectoCtrl.subproyectoEditable = null;
                         planeacionProyectoCtrl.subProyectoSeleccionado = null;
                	}else{
                		 AdeaServicios.alerta("error", respuesta.error);
                		 seleccionarSubProyecto(planeacionProyectoCtrl.subProyectoSeleccionado)
                	}

                   
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al registrar un Subproyecto: " + error.data);
                })
        		
        	}

           
        }

        function consultaAreas() {

            var promesa = proyectoServicios.consultaAreas().$promise;

            promesa.then(function (respuesta) {
                planeacionProyectoCtrl.listAreas = respuesta;

                if (planeacionProyectoCtrl.listAreas.length == 0) {
                    AdeaServicios.alerta("error", "No existen Áreas para Control Productivo");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta de Áreas: " + error.data);
            })
        }

        function consultaProyectosCtrl(idArea, modo) {
            $log.info('consultaProyectosCtrl');

            // planeacionProyectoCtrl.listProyCtrl = [];
            planeacionProyectoCtrl.listProyCtrl = [];
            if(idArea != null && idArea != undefined && idArea != '' ){

	            var params = {
	                pIdArea: idArea
	            }
	
	            var promesa = proyectoServicios.consultaProyectosCtrl(params).$promise;
	
	            promesa.then(function (respuesta) {
	                
	            	if(modo == 'M'){
	                   planeacionProyectoCtrl.listProyCtrlMod = respuesta;
	            	}else{
	            	   planeacionProyectoCtrl.listProyCtrl = respuesta;
	            	}
	                
	                
	                if (respuesta.length == 0) {
	                    planeacionProyectoCtrl.listProyCtrl = [];
	                    AdeaServicios.alerta("error", "No existen Proyectos para Control Productivo");
	                }
	            });
	
	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta de Proyectos: " + error.data);
	            })
            }
        }

        function consultaTickets() {
            $log.info('----------*******');

            var promesa = proyectoServicios.consultaTickets({pIdTicket: 1}).$promise;

            promesa.then(function (respuesta) {
                planeacionProyectoCtrl.listTickets = respuesta;

                if (planeacionProyectoCtrl.listTickets.length == 0) {
                    AdeaServicios.alerta("error", "No existen Tickets para asocial al Subproyecto");
                }
            });

            promesa.catch(function (error) {
                $log.info(error);
                AdeaServicios.alerta("error", "Error al consulta de Tickets: " + error.data);
            })
        }

        function consultaActividades(idArea) {

            var params = {
                pIdArea: idArea,
                pIdClasificacion: 'TIEMPO PRODUCTIVO'
            }

            var promesa = proyectoServicios.consultaActividades(params).$promise;

            promesa.then(function (respuesta) {
                planeacionProyectoCtrl.listActividades = respuesta;
                if (planeacionProyectoCtrl.listActividades.length == 0) {
                    AdeaServicios.alerta("error", "No existen Actividades para Control Productivo");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta de Actividades: " + error.data);
            })
        }

        function planearActividad() {
            var filtro = _.filter(planeacionProyectoCtrl.listActividadesSubProy, function (act) {

                return act.nombreActividad === planeacionProyectoCtrl.actividad.nombreActividad;
            });

            if (filtro.length == 0) {

                var filtro = _.filter(planeacionProyectoCtrl.listActividadPlan, function (act) {

                    return (moment(planeacionProyectoCtrl.actividad.fecFin) >= moment(act.fecIni) && moment(planeacionProyectoCtrl.actividad.fecFin) <= moment(act.fecFin)
                        || moment(planeacionProyectoCtrl.actividad.fecIni) <= moment(act.fecFin) && moment(planeacionProyectoCtrl.actividad.fecFin) >= moment(act.fecFin));

                });

                if (filtro.length > 0) {
                    angular.element('#conflictFecha').modal('show');
                } else {

                    if (planeacionProyectoCtrl.actividad.idTicket != null) {
                        var filtro = _.filter(planeacionProyectoCtrl.listTickets, function (act) {

                            return act.idTicket == planeacionProyectoCtrl.actividad.idTicket;
                        });

                        planeacionProyectoCtrl.actividad.descTicket = filtro[0].resumen;
                    }

                    planeacionProyectoCtrl.listActividadPlan.push(planeacionProyectoCtrl.actividad);
                    planeacionProyectoCtrl.listActividadPlan = $filter('ordenarList')(planeacionProyectoCtrl.listActividadPlan);
                    planeacionProyectoCtrl.actividad = {};
                    planeacionProyectoCtrl.actividad.idTicket = planeacionProyectoCtrl.subProyecto.idTicket;
                }
            } else {
                AdeaServicios.alerta("error", "La actividad Seleccionada ya" +
                    " tiene una planeación");
            }
        }

        function planearActividadMod() {
        	
        	if((planeacionProyectoCtrl.actividad.predecesora == undefined || planeacionProyectoCtrl.actividad.predecesora == null) || (planeacionProyectoCtrl.actividad.predecesora != null && planeacionProyectoCtrl.actividad.predecesora != undefined && moment(planeacionProyectoCtrl.actividad.predecesora.fecFin) < moment(planeacionProyectoCtrl.actividad.fecIni))){
        		
	            var filtro = _.filter(planeacionProyectoCtrl.listActividadesSubProy, function (act) {
	
	                return act.nombreActividad === planeacionProyectoCtrl.actividad.nombreActividad;
	            });
	
	            if (filtro.length == 0) {
	
	                var filtro = _.filter(planeacionProyectoCtrl.listActividadesSubProy, function (act) {
	
	                    return (moment(planeacionProyectoCtrl.actividad.fecFin) >= moment(act.fecIni) && moment(planeacionProyectoCtrl.actividad.fecFin) <= moment(act.fecFin)
	                        || moment(planeacionProyectoCtrl.actividad.fecIni) <= moment(act.fecFin) && moment(planeacionProyectoCtrl.actividad.fecFin) >= moment(act.fecFin));
	
	                });
	
	
	                if (filtro.length > 0) {
	                    angular.element('#conflictFecha').modal('show');
	                } else {
	
	                    if (planeacionProyectoCtrl.actividad.idTicket != null) {
	                        var filtro = _.filter(planeacionProyectoCtrl.listTickets, function (act) {
	                            return act.idTicket == planeacionProyectoCtrl.actividad.idTicket;
	                        });
	
	                        planeacionProyectoCtrl.actividad.descTicket = filtro[0].resumen;
	                    }
	                    
	                    addActividad();
	                                   
	                }
	            } else {
	                AdeaServicios.alerta("error", "La actividad Seleccionada ya" +
	                    " tiene una planeación");
	            }
        	}else{
        		AdeaServicios.alerta("error", "La actividad no se puede Registrar ya que" +
                " la fecha debe ser Mayor a la Fecha Fin de la Actividad Predecesora");
        	}
        }

        function modificaFecha() {
            if (planeacionProyectoCtrl.modificaFecIniSub == 'M') {
                if (planeacionProyectoCtrl.subproyectoEditable.fecIni > planeacionProyectoCtrl.listActividadesSubProy[0].fecIni) {
                    AdeaServicios.alerta("error", "No se puede reprogramar la fecha de Inicio del Proyecto ya que la" +
                        " fecha selecciona es mayor a la fecha de Inicio de la Primera actividad planeada");
                    planeacionProyectoCtrl.subproyectoEditable.fecIni = planeacionProyectoCtrl.subProyectoSeleccionado.fecIni;
                } else {
                	planeacionProyectoCtrl.listActividadesSubProy[0].fecIni = planeacionProyectoCtrl.subproyectoEditable.fecIni;
                    planeacionProyectoCtrl.fecIniModAct = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                    planeacionProyectoCtrl.fecActIni = moment(planeacionProyectoCtrl.subproyectoEditable.fecIni);
                }
            } else {
                if (planeacionProyectoCtrl.subProyecto.fecIni > planeacionProyectoCtrl.listActividadPlan[0].fecIni) {
                    AdeaServicios.alerta("error", "No se puede reprogramar la fecha de Inicio del Proyecto ya que la" +
                        " fecha selecciona es mayor a la fecha de Inicio de la Primera actividad planeada");
                    planeacionProyectoCtrl.subProyecto.fecIni = planeacionProyectoCtrl.fechaIniResp;
                } else {
                    planeacionProyectoCtrl.listActividadPlan[0].fecIni = planeacionProyectoCtrl.subProyecto.fecIni;
                    planeacionProyectoCtrl.fecIniModAct = moment(planeacionProyectoCtrl.subProyecto.fecIni);
                }
            }

            angular.element('#cambiaFecha').modal('hide');
        }

        function modificaFechaFin() {
            if (planeacionProyectoCtrl.modificaFecFinSub == 'M') {
                if (planeacionProyectoCtrl.subproyectoEditable.fecFin < planeacionProyectoCtrl.listActividadesSubProy[planeacionProyectoCtrl.listActividadesSubProy.length - 1].fecFin) {
                    AdeaServicios.alerta("error", "No se puede reprogramar la fecha de Fin del Proyecto ya que la" +
                        " fecha selecciona es menor a la fecha de Finalización de la ultima actividad planeada");
                    planeacionProyectoCtrl.subproyectoEditable.fecFin = planeacionProyectoCtrl.subProyectoSeleccionado.fecFin;
                } else {
                    planeacionProyectoCtrl.fecFinModAct = planeacionProyectoCtrl.subproyectoEditable.fecFin;
                    planeacionProyectoCtrl.fecActFin = moment(planeacionProyectoCtrl.subproyectoEditable.fecFin);
                }
            } else {
                if (planeacionProyectoCtrl.subProyecto.fecFin < planeacionProyectoCtrl.listActividadPlan[planeacionProyectoCtrl.listActividadPlan.length - 1].fecFin) {
                    AdeaServicios.alerta("error", "La fecha seleccionada es menor que la que tiene programada la" +
                        " ultima tarea, no es posible asignar esa fecha");
                    planeacionProyectoCtrl.subProyecto.fecFin = planeacionProyectoCtrl.fechaFinResp;
                } else {
                    planeacionProyectoCtrl.listActividadPlan[planeacionProyectoCtrl.listActividadPlan.length - 1].fecIni = planeacionProyectoCtrl.subProyecto.fecIni;

                }
            }
            angular.element('#cambiaFechaFin').modal('hide');
        }

        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            var bndDay = false; 
            
            angular.forEach(planeacionProyectoCtrl.diasFestivos, function (obj) {
            	if(data.date.getTime() == obj.holiday){
            		bndDay = true;
            	}
            });


            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) || bndDay ;
        }

        function addActividad() {
            
        	planeacionProyectoCtrl.actividad.idArea = planeacionProyectoCtrl.actividad.area.idArea;
        	delete planeacionProyectoCtrl.actividad.area;
        	
        	if(planeacionProyectoCtrl.actividad.predecesora != undefined && planeacionProyectoCtrl.actividad.predecesora != null){
        		planeacionProyectoCtrl.actividad.predecesora = planeacionProyectoCtrl.actividad.predecesora.idActividad;
        	}
        	
        	var promesa = proyectoServicios.agregarActividadSub(planeacionProyectoCtrl.actividad).$promise;
        	
        	planeacionProyectoCtrl.actividad.idSubproyecto = planeacionProyectoCtrl.subproyectoEditable.idSubproyecto;

            promesa.then(function (respuesta) {
                	
            	planeacionProyectoCtrl.listActividadesSubProy.push(respuesta);
            	planeacionProyectoCtrl.listActividadesSubProy = $filter('ordenarList')(planeacionProyectoCtrl.listActividadesSubProy);
            	planeacionProyectoCtrl.actividad = {};
                planeacionProyectoCtrl.actividad.idTicket = planeacionProyectoCtrl.subproyectoEditable.idTicket;
                planeacionProyectoCtrl.actividad.recursos = [];
                planeacionProyectoCtrl.plantillaArea = [];
                angular.element('#conflictFecha').modal('hide');
                planeacionProyectoCtrl.indexTabActive = 0;
                mostrarDetalleRegistro(true);
                consultaActividadesProy('N');
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
            })
        	
        }

        function seleccionarActividad(reg) {
            planeacionProyectoCtrl.actividadSeleccionada = reg;
            planeacionProyectoCtrl.actividadEditable = angular.copy(planeacionProyectoCtrl.actividadSeleccionada);
            consultaPlantillaArea(planeacionProyectoCtrl.actividadEditable.idArea, 'M');
            // consultaProyectosCtrl(planeacionProyectoCtrl.actividadEditable.idAreaCtrlProd,
			// 'M');
            obtenerArea(planeacionProyectoCtrl.actividadEditable.idArea);
            consultaEstatusAct();
            mostrarDetalleRegistro(false);
            planeacionProyectoCtrl.mostrarActividades = true;
            planeacionProyectoCtrl.fecFinAct = moment(planeacionProyectoCtrl.actividadEditable.fecIni);
            consultaActividadesProy();
            consultaPlantillaAct();
            planeacionProyectoCtrl.recurso = {};
            planeacionProyectoCtrl.fecIniActSel = moment(planeacionProyectoCtrl.actividadSeleccionada.fecIni);
            planeacionProyectoCtrl.fecFinActSel = moment(planeacionProyectoCtrl.actividadSeleccionada.fecFin);
            planeacionProyectoCtrl.recurso.fecIni = moment(planeacionProyectoCtrl.actividadSeleccionada.fecIni);
        }

        function delActividad() {

            if (planeacionProyectoCtrl.modeEliminarAct == 'M') {
            	eliminarActividad();
                angular.element('#editarSubProyecto').modal('show');
                
            } else {
                var index = planeacionProyectoCtrl.listActividadPlan.indexOf(planeacionProyectoCtrl.actividadSeleccionada);
                planeacionProyectoCtrl.listActividadPlan.splice(index, 1);
                
            }
            angular.element('#eliminarAct').modal('hide');
            
        }

        function editActividad() {
        	
        	var predecesora = planeacionProyectoCtrl.actividadEditable.predecesora;
        	
        	 if (predecesora != null && predecesora != undefined) {
                 var filtro = _.filter(planeacionProyectoCtrl.listActividadesSub, function (act) {
                     return act.idActividad == predecesora;
                 });

                 planeacionProyectoCtrl.actividadEditable.predecesora = filtro[0];
             }
        	         	
        	if((planeacionProyectoCtrl.actividadEditable.predecesora == undefined || planeacionProyectoCtrl.actividadEditable.predecesora == null) || (planeacionProyectoCtrl.actividadEditable.predecesora != null && planeacionProyectoCtrl.actividadEditable.predecesora != undefined && moment(planeacionProyectoCtrl.actividadEditable.predecesora.fecFin) < moment(planeacionProyectoCtrl.actividadEditable.fecIni))){
        		        		
        		if((planeacionProyectoCtrl.actividadSeleccionada.fecIni != planeacionProyectoCtrl.actividadEditable.fecIni || planeacionProyectoCtrl.actividadSeleccionada.fecFin != planeacionProyectoCtrl.actividadEditable.fecFin) && planeacionProyectoCtrl.actividadEditable.estatus != 'A'){
        			angular.element('#reprogramacion').modal('show');
        		} else {
	           			
	                var filtro = _.filter(planeacionProyectoCtrl.listActividadesSubProy, function (act) {
	                	return planeacionProyectoCtrl.actividadEditable.idActividad != act.idActividad;
	                });
	                
	                $log.info(filtro);
	
	                var filtroAct = _.filter(filtro, function (act) {
	                       return (moment(planeacionProyectoCtrl.actividadEditable.fecFin) >= moment(act.fecIni) &&
	                           moment(planeacionProyectoCtrl.actividadEditable.fecFin) <= moment(act.fecFin)
	                           || moment(planeacionProyectoCtrl.actividadEditable.fecIni) <= moment(act.fecFin) && moment(planeacionProyectoCtrl.actividadEditable.fecFin) >= moment(act.fecIni));
	                   });
	           		
	                if (filtroAct.length > 0) {
	                	
	                	if(planeacionProyectoCtrl.actividadSeleccionada.fecIni != planeacionProyectoCtrl.actividadEditable.fecIni || planeacionProyectoCtrl.actividadSeleccionada.fecFin != planeacionProyectoCtrl.actividadEditable.fecFin){
	                		angular.element('#conflictFechaMod').modal('show');
	                	}else{
	                		modificacionActividad();
	                	}
	                }else{
	                	modificacionActividad();
	                }
        		}
        	}else{
        		AdeaServicios.alerta("error", "La actividad no se puede Modificar ya que" +
                " la fecha Seleccionada debe ser Mayor a la Fecha Fin de la Actividad Predecesora seleccionada");
        		
        		planeacionProyectoCtrl.actividadEditable.predecesora = null;
        	}
        	
        	
        }
        
        
        function modificacionActividad(modo){
        	        	
        	if(modo == 'C'){
        		planeacionProyectoCtrl.reprogramacion.idActividad = planeacionProyectoCtrl.actividadEditable.idActividad;
        		planeacionProyectoCtrl.reprogramacion.fecIniAct = planeacionProyectoCtrl.actividadSeleccionada.fecIni;
        		planeacionProyectoCtrl.reprogramacion.fecFinAct = planeacionProyectoCtrl.actividadSeleccionada.fecFin;
        		planeacionProyectoCtrl.actividadEditable.reprogramacion.push(planeacionProyectoCtrl.reprogramacion);
        	}
        	
        	delete planeacionProyectoCtrl.actividadEditable.color;
        	
        	if(planeacionProyectoCtrl.areaMod.nombre != 'SISTEMAS DESARROLLO' && planeacionProyectoCtrl.areaMod.nombre != 'SOPORTE APLICATIVO'){
        		planeacionProyectoCtrl.actividadEditable.tecnologia = null;
        	}
        	
        	if(planeacionProyectoCtrl.actividadEditable.predecesora != undefined && planeacionProyectoCtrl.actividadEditable.predecesora != null){
        		planeacionProyectoCtrl.actividadEditable.predecesora = planeacionProyectoCtrl.actividadEditable.predecesora.idActividad;
        	}
        	
        	var promesa = proyectoServicios.modificarActividad(planeacionProyectoCtrl.actividadEditable).$promise;

            promesa.then(function (respuesta) {
            	
            	
            	if(planeacionProyectoCtrl.actividadSeleccionada.fecIni != planeacionProyectoCtrl.actividadEditable.fecIni || planeacionProyectoCtrl.actividadSeleccionada.fecFin != planeacionProyectoCtrl.actividadEditable.fecFin){
                	angular.element('#conflictFechaMod').modal('hide');
                }
            	var index = planeacionProyectoCtrl.listActividadesSubProy.indexOf(planeacionProyectoCtrl.actividadSeleccionada);
            	planeacionProyectoCtrl.listActividadesSubProy[index] = respuesta;
            	if(modo == 'C'){
            		angular.element('#reprogramacion').modal('hide');
            		planeacionProyectoCtrl.reprogramacion = null;
            	}
            	mostrarDetalleRegistro(true);
            	consultaActividadesProy('N');
            	AdeaServicios.alerta("success", "La Actividad se Modifico" +
                 " Satisfactoriamente");
            	
            	planeacionProyectoCtrl.actividadSeleccionada = null; 
            	planeacionProyectoCtrl.actividadEditable = null;
            });

            promesa.catch(function (error) {
            	planeacionProyectoCtrl.actividadEditable.reprogramacion = planeacionProyectoCtrl.actividadSeleccionada.reprogramacion;
                AdeaServicios.alerta("error", "Error al actualizar la Actividad: " + error.data);
            })
        }

        function addActividadMod() {
            var index = planeacionProyectoCtrl.listActividadPlan.indexOf(planeacionProyectoCtrl.actividadSeleccionada);
            planeacionProyectoCtrl.listActividadPlan[index] = planeacionProyectoCtrl.actividadEditable;
            planeacionProyectoCtrl.actividadEditable = null;
            planeacionProyectoCtrl.actividadSeleccionada = null;
            angular.element('#conflictFechaMod').modal('hide');
        }

        function construyeObjGantt(listaSubProy) {
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

            planeacionProyectoCtrl.data =  subProyectos;
        }

        function consultaEstatus() {

            var params = {
                keyCatalogo: 'ESTATUSPROY',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                planeacionProyectoCtrl.estatus = respuesta;

                if (planeacionProyectoCtrl.estatus.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de perfiles");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de Perfiles: " + error.data);
            })


        }

        function setModeEliminar() {
            $log.info('ModeEliminar');
            planeacionProyectoCtrl.modeEliminarAct = 'M';
        }

        function setModeEditar() {
            $log.info('ModeEliminar');
            planeacionProyectoCtrl.modeEditarAct = 'M';
            setFechasActividadesMdo(planeacionProyectoCtrl.subproyectoEditable);
        }

        function noHaCambiadoActividad() {
            var bndCambio = false;

            if (!angular.equals(planeacionProyectoCtrl.actividadSeleccionada, planeacionProyectoCtrl.actividadEditable)) {
                bndCambio = true;
            }

            return bndCambio;
        }

        function setFechasActividadesMdo(value) {
            $log.info(value)
            planeacionProyectoCtrl.modeEditarAct = 'A';
            planeacionProyectoCtrl.fecIniModAct = moment(value.fecIni);
            planeacionProyectoCtrl.fecFinModAct = moment(value.fecFin);
        }

        function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
                planeacionProyectoCtrl.areasAWM = respuesta;

                if (planeacionProyectoCtrl.areasAWM.length == 0) {
                    AdeaServicios.alerta("error", "No existen areas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })


        }
        
        function consultaPlantillaArea(idArea, modo){
        	$log.info("ConsultaPlantilla----")
        	var params = {
                    idArea: idArea,
                    estatus: "A"
                };

                var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

                promesa.then(function (respuesta) {
                	
                	if(modo == 'M'){
                		planeacionProyectoCtrl.plantillaAreaMod = respuesta;
                		
                	}else{
                		planeacionProyectoCtrl.plantillaArea = respuesta;
                		if (planeacionProyectoCtrl.plantillaArea.length == 0) {
                            AdeaServicios.alerta("error", "No existen recursos registrados para el area Seleccionada");
                        }
                	}

                   
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
                })
        }
        
        function graficaGantActividades(lista){
        	planeacionProyectoCtrl.actvidadesGantt = construirGrafica(lista);
        }
        
        function graficaGantTraslapes(lista){
        	planeacionProyectoCtrl.actvidadesGanttTraslapes = construirGrafica(lista);
        	planeacionProyectoCtrl.bndGant = true;
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
        
        
        function eliminarActividad(){
        	$log.info("eliminarActividad----")
        	var params = {
        		pIdActividad: planeacionProyectoCtrl.actividadSeleccionada.idActividad
                };

                var promesa = proyectoServicios.eliminaActividad(params).$promise;

                promesa.then(function (respuesta) {
                	
                	if (respuesta.error == 'ok') {
                		consultaActividadesProy('N');
                		consultaRecursosSubproyecto();
                		mostrarDetalleRegistro(true);
                		planeacionProyectoCtrl.actividadSeleccionada = null; 
                		AdeaServicios.alerta("succes", "La Actividad se Elimino del Plan" +
                         " Satisfactoriamente");
                		 
                	}else{
                		AdeaServicios.alerta("error", respuesta.error);
                	}
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al eliminar la Actividad" + error.data);
                })
        }
        
        
        function consultaEstatusAct() {

            var params = {
                keyCatalogo: 'ESTATUS_ACT',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                planeacionProyectoCtrl.estatusActividades = respuesta;

                if (planeacionProyectoCtrl.estatusActividades.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de Actividades");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de Actividades: " + error.data);
            })


        }
        
        function mostrarDetalleRegistro(valor) {
            $log.info("Entra al metodo mostrarDetalleRegistro() del Controlador ClientesController");
            
            planeacionProyectoCtrl.mostrarDetalleAct(valor);
        }
        
        function regresar(){
        	planeacionProyectoCtrl.actividadSeleccionada = null;
        	planeacionProyectoCtrl.actividadEditable = null;
        }
        
        
        function consultaTecnologias() {

            var params = {
                keyCatalogo: 'TECNOLOGIA',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                planeacionProyectoCtrl.tecnologias = respuesta;

                if (planeacionProyectoCtrl.estatus.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de tecnologias");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de tecnologias: " + error.data);
            })


        }
        
        function consultaActividadesProy(modo) {
        	$log.info('consultaActividadesProy');
        	
        	
        	var params = {pIdSubProyecto: planeacionProyectoCtrl.subProyectoSeleccionado.idSubproyecto};

            var promesa = proyectoServicios.consultaActividades(params).$promise;

            promesa.then(function (respuesta) {
            	
            	if(modo == 'A'){
            		if(planeacionProyectoCtrl.actividad != null && planeacionProyectoCtrl.actividad != undefined){
                    	
                    	planeacionProyectoCtrl.listActividadesSub = _.filter(respuesta, function (act) {
    	                	return moment(planeacionProyectoCtrl.actividad.fecIni) >  moment(act.fecFin);
    	                });
                    }
            	}else if(modo == 'N'){
            		
            		planeacionProyectoCtrl.listActividadesSubProy = respuesta;
            		planeacionProyectoCtrl.listActividadesSubProy = $filter('ordenarListMilis')(planeacionProyectoCtrl.listActividadesSubProy);
            	}else{
            		if(planeacionProyectoCtrl.actividadSeleccionada != null && planeacionProyectoCtrl.actividadSeleccionada != undefined){
                    	
                    	planeacionProyectoCtrl.listActividadesSub = _.filter(respuesta, function (act) {
    	                	return planeacionProyectoCtrl.actividadSeleccionada.idActividad != act.idActividad && moment(planeacionProyectoCtrl.actividadSeleccionada.fecIni) >  moment(act.fecFin);
    	                });
                    }
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta de Áreas: " + error.data);
            })
        }
        
        function obtenerArea(idArea){
        	$log.info('obtenerArea');
        	
       	 	if (idArea != null && idArea != undefined) {
                var filtro = _.filter(planeacionProyectoCtrl.subproyectoEditable.areas, function (act) {
                    return act.idArea == idArea;
                });

                planeacionProyectoCtrl.areaMod = filtro[0];
            }
        }
        
        function asignarRecurso(){
        	planeacionProyectoCtrl.bndGant = false;
        	var fechaIni = new Date(planeacionProyectoCtrl.actividadSeleccionada.fecIni);
        	var fechaFin = new Date(planeacionProyectoCtrl.actividadSeleccionada.fecFin);
        	
        	planeacionProyectoCtrl.recurso.fecIni = moment(planeacionProyectoCtrl.actividadEditable.fecIni);
        	
        	var params = {pIdPlantilla: planeacionProyectoCtrl.recurso.idPlantilla,
        				  fecIni:  fechaIni.getFullYear()+'-'+(fechaIni.getMonth()+1)+'-'+fechaIni.getDate(),
        				  fecFin: fechaFin.getFullYear()+'-'+(fechaFin.getMonth()+1)+'-'+fechaFin.getDate()
        				 };

            var promesa = proyectoServicios.consultaPlantillaActividad(params).$promise;

            promesa.then(function (respuesta) {
               
                planeacionProyectoCtrl.actividadesPlantilla = respuesta;
                
                
                if(planeacionProyectoCtrl.actividadesPlantilla.length > 0){	
                		var filtro = _.filter(planeacionProyectoCtrl.plantillaSeleccionada, function (act) {
                            return act.idPlantilla === planeacionProyectoCtrl.recurso.idPlantilla;
                        });
                		
                		if(filtro.length > 0){
                			 planeacionProyectoCtrl.recurso.horasAsig = 9;
                			angular.element('#recursoActividad').modal('show');     
                		}else{
                			
                			planeacionProyectoCtrl.actividadEdit = angular.copy(planeacionProyectoCtrl.actividadSeleccionada);
                			planeacionProyectoCtrl.actividadEdit.rangos = [];
                			planeacionProyectoCtrl.actividadesPlantillaEditable = angular.copy(planeacionProyectoCtrl.actividadesPlantilla);
                			
                			angular.forEach(planeacionProyectoCtrl.actividadesPlantillaEditable, function (act) {
                				 
                				 var rangos = [];
                				 
                				 var range = new Object();
                				 	 range.fecIni = act.fecIni; 
                				 	 range.fecFin = act.fecFin;
                				 
                				 var range2 = new Object();
                				 range2.fecIni = planeacionProyectoCtrl.actividadSeleccionada.fecIni; 
                				 range2.fecFin = planeacionProyectoCtrl.actividadSeleccionada.fecFin;
                				 
                				 rangos.push(range, range2);
                				 
                				 var promesa = proyectoServicios.consultaRango(rangos).$promise;
                					
                					promesa.then(function (respuesta) {
                						act.rango = respuesta;
                						
                						var filtro = _.filter(planeacionProyectoCtrl.actividadEdit.rangos, function (ran) {
                                            return angular.equals(ran, respuesta);
                                        });
                    						
                						if(filtro.length == 0){
                    						planeacionProyectoCtrl.actividadEdit.rangos.push(respuesta);
                    					}
                					});
                					
                					promesa.catch(function (error) {
                					   AdeaServicios.alerta("error", "Error obtener el rango de fechas: " + error.data);
                					})

                			 });
                			 $timeout(function(){
                				 planeacionProyectoCtrl.actividadEdit.rangos = $filter('ordenarListMilis')(planeacionProyectoCtrl.actividadEdit.rangos);
                    			 planeacionProyectoCtrl.actividadesPlantillaEditable.push(planeacionProyectoCtrl.actividadEdit);

                    			 angular.element('#traslapeActividad').modal('show');              		
                			 }, 1000);

                			 
                		}
                }else{
                	planeacionProyectoCtrl.recurso.horasAsig = 9;
                	angular.element('#recursoActividad').modal('show');              	
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar las actividades del Recurso: " + error.data);
            })
        }
        
        function guardarAsignacion(){
        	$log.info('guardarAsignacion');
        	
        	var filtro = _.filter(planeacionProyectoCtrl.plantillaSeleccionada, function (act) {
                return act.idPlantilla === planeacionProyectoCtrl.recurso.idPlantilla && ((moment(planeacionProyectoCtrl.recurso.fecIni) <= act.fecFin && moment(planeacionProyectoCtrl.recurso.fecIni) >= act.fecIni) || (moment(planeacionProyectoCtrl.recurso.fecFin) <=  act.fecFin && moment(planeacionProyectoCtrl.recurso.fecFin) >= act.fecIni));
            });
        	
        	if(filtro.length > 0){
        		AdeaServicios.alerta("error", "La persona que desea Asignar a esta actividad ya cuenta con fechas Planeadas para las fechas seleccionadas para esta Actividad");
        	}else{
        		planeacionProyectoCtrl.recurso.idActividad = planeacionProyectoCtrl.actividadSeleccionada.idActividad;
    			planeacionProyectoCtrl.recurso.fecIni = planeacionProyectoCtrl.actividadSeleccionada.fecIni;
    			planeacionProyectoCtrl.recurso.fecFin = planeacionProyectoCtrl.actividadSeleccionada.fecFin;
    			planeacionProyectoCtrl.recurso.horasAsig = planeacionProyectoCtrl.recurso.horasAsig;
            	var promesa = proyectoServicios.insertarActividadPlantilla(planeacionProyectoCtrl.recurso).$promise;

                promesa.then(function (respuesta) {
                	consultaPlantillaAct();
                	planeacionProyectoCtrl.recurso = null;
                	angular.element('#recursoActividad').modal('hide');  
                    consultaPlantillaArea(planeacionProyectoCtrl.actividadEditable.idArea, 'M');
                	AdeaServicios.alerta("success", "Se Registro de manera Satisfactoria la Persona Seleccionada");
                	consultaRecursosSubproyecto();
                	consultaActividadesProy('N');
                });
        	}
        	
        }
        
        function guardarConflicto(){
        	$log.info('guardarConflicto');
        	
        	$log.info(planeacionProyectoCtrl.actividadesPlantillaEditable);
        	
        	
			var listaAct = []; 
			var contHorasRango = [];
			
			$log.info(planeacionProyectoCtrl.actividadesPlantillaEditable);
			  
			angular.forEach(planeacionProyectoCtrl.actividadesPlantillaEditable, function (act) { 
				var actividad = {};
			  
				if(act.idActividadPlantilla != null && act.idActividadPlantilla != undefined && act.idActividadPlantilla != ''){
					actividad.idActividadPlantilla = act.idActividadPlantilla; 
					actividad.rango = act.rango;
				}else{
					actividad.rangos = act.rangos;
				}
				actividad.idActividad = act.idActividad; 
				actividad.horasAsig = act.horasAsig; 
				actividad.idPlantilla = planeacionProyectoCtrl.recurso.idPlantilla;
				actividad.fecIni = act.fecIni;
				actividad.fecFin = act.fecFin;
				
			    listaAct.push(actividad);
			    
			 });
			
			$log.info(listaAct);
			
			 angular.forEach(planeacionProyectoCtrl.actividadEdit.rangos, function (range) { 
				  var contador = 0;
				
				  angular.forEach(listaAct, function (act) { 
					  if(act.idActividadPlantilla != null && act.idActividadPlantilla != undefined && act.idActividadPlantilla != ''){
						  if(range.fecIni == act.rango.fecIni && range.fecFin == act.rango.fecFin){
							  contador = contador + act.horasAsig;
					      }
					  }else{
						  angular.forEach(act.rangos, function (ran) { 
				    			if(range.fecIni == ran.fecIni && range.fecFin == ran.fecFin){
				    				contador = contador + range.horasAsig;
						    	}
				    		})
					  }
				  })
				  contHorasRango.push(contador);
			 });
			 
			 var bndPass = true;
			    
			 angular.forEach(contHorasRango, function (cont) { 
				 if(cont != 9){
					 bndPass = false;
				 }
			 });
			         	 
			 if(!bndPass){ 
				 AdeaServicios.alerta("error", "No se puede asignar los tiempo establecidos, favor de validar que las horas capturadas sean de 9 horas por rangos");
			}else{ 
				
				var param = {
						detalleRangos: listaAct
				};
				
				var promesa = proyectoServicios.insertarActPlant(param).$promise;
				
				promesa.then(function (respuesta) {
					
					 if (respuesta.error == 'ok') {
						 AdeaServicios.alerta("success", "Se Proceso de manera satisfactoria la Actividad y se realizarón los ajustes a los conflictos");
							planeacionProyectoCtrl.recurso = null;
							angular.element('#traslapeActividad').modal('hide');
							consultaPlantillaAct();
							consultaActividadesProy('N');
							consultaPlantillaArea(planeacionProyectoCtrl.actividadEditable.idArea,'M'); 
							consultaRecursosSubproyecto();
							
					 }else{
						 AdeaServicios.alerta("error", respuesta.error);
					 }
					
				});
				  
				promesa.catch(function (error) {
				  AdeaServicios.alerta("error", "Error al Guardar la actividad: " + error.data); 
				
				});
			}
				 
        }
        
        function seleccionActividades(){
        	$log.info('seleccionActividades');
        	planeacionProyectoCtrl.indexTabActive = 0;
        	planeacionProyectoCtrl.actvidadesGantt = null;
        	planeacionProyectoCtrl.actividadSeleccionada = null;
        	planeacionProyectoCtrl.actividadEditable = null;
        	mostrarDetalleRegistro(true);
        	planeacionProyectoCtrl.listActividadesSub = null;
        }
        
        function seleccionRecursos(){
        	$log.info('seleccionActividades');
        	planeacionProyectoCtrl.indexTabActive = 2;
        	planeacionProyectoCtrl.actvidadesGantt = null;
        	
        }
        
        function registrarActividades(){
        	planeacionProyectoCtrl.mostrarActividades = false;
        	seleccionActividades();
        	planeacionProyectoCtrl.actividad = null;
        	consultaActividadesProy('A');
        	consultaActividadesProy('A');
        }
        
        
        function consultaPlantillaAct(){
        	        	
        	var params = {idActividad: planeacionProyectoCtrl.actividadSeleccionada.idActividad
        				 };

            var promesa = proyectoServicios.consultaPlantillaActividad(params).$promise;

            promesa.then(function (respuesta) {
               
                planeacionProyectoCtrl.plantillaSeleccionada = respuesta;
                
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los Recursos Asociados a esta Actividad: " + error.data);
            })
        }
        
        function changeDateAct(){
        	if(moment(planeacionProyectoCtrl.recurso.fecFin) != null && moment(planeacionProyectoCtrl.recurso.fecFin) < moment(planeacionProyectoCtrl.recurso.fecIni)){
        		planeacionProyectoCtrl.recurso.fecFin = null;
        	}
        }
        
        function changeFecSub(){
        	$log.info('--changeFecSub--');
        	if(moment(planeacionProyectoCtrl.subproyectoEditable.fecFin) != null && moment(planeacionProyectoCtrl.subproyectoEditable.fecFin) < moment(planeacionProyectoCtrl.subproyectoEditable.fecIni)){
        		planeacionProyectoCtrl.subproyectoEditable.fecFin = null;
        	}
        }
        
        function seleccionarEliminacion(recurso){
        	planeacionProyectoCtrl.recursoSeleccionado = recurso;
        	angular.element('#eliminarActPlan').modal('show');  
        }
        
        function eliminarPlan(){
        	
        	var params = {
        			pIdActividad: planeacionProyectoCtrl.actividadSeleccionada.idActividad,
        	        pIdPlantilla: planeacionProyectoCtrl.recursoSeleccionado[0].idPlantilla
        	};
        	       	
			var promesa = proyectoServicios.eliminarActPlantilla(params).$promise;
			
			promesa.then(function (respuesta) {
				angular.element('#eliminarActPlan').modal('hide');  
				consultaPlantillaAct();
			    AdeaServicios.alerta("success", "Se elimino de manera correcta la Planeación de la actividad Seleccionada");
			    consultaRecursosSubproyecto();
			    consultaActividadesProy('N');
			});
			
			promesa.catch(function (error) {
			   AdeaServicios.alerta("error", "Error al eliminar la Actividad: " + error.data);
			})
        	
        }
        
        
        function consultaRango(rangos){
        	var rango = null;
        	
			var promesa = proyectoServicios.consultaRango(rangos).$promise;
			
			promesa.then(function (respuesta) {
				planeacionProyectoCtrl.rango = respuesta
			});
			
			promesa.catch(function (error) {
			   AdeaServicios.alerta("error", "Error obtener el rango de fechas: " + error.data);
			})
        	
        }
        
        function validaRangos(rango, rango2){
        	var bnd = false;
        	
        	if(rango != undefined){
        		if(rango.fecIni == rango2.fecIni && rango.fecFin == rango2.fecFin){
        			bnd = true;
        		}
        	}

        	return bnd;
        }
        
        function consultaRecursosSubproyecto(){
        	var params = {
        			pIdSubproyecto: planeacionProyectoCtrl.subProyectoSeleccionado.idSubproyecto
        	};
        	
			var promesa = proyectoServicios.consultaRecursosSubproyecto(params).$promise;
			
			promesa.then(function (respuesta) {
				planeacionProyectoCtrl.recursosSubproyecto = respuesta
			});
			
			promesa.catch(function (error) {
			   AdeaServicios.alerta("error", "Error obtener las personas Asignadas al Subproyecto: " + error.data);
			});
        	
        }
        
        function consultaTipoProyecto() {

            var params = {
                keyCatalogo: 'TIPO_SUBPROYECTO',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                planeacionProyectoCtrl.catTipoproyecto = respuesta;

                if (planeacionProyectoCtrl.catTipoproyecto.length == 0) {
                    AdeaServicios.alerta("error", "No existen registros para tipo de Subproyecto");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo : " + error.data);
            })
        }

        
    }
})
();