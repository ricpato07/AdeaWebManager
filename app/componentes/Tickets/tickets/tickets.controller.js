(function () {
    'use strict';

    angular
        .module('adeaModule')
        .controller('TicketController', TicketController);

    TicketController.$inject = ['$log', 'tblSubProyectos', 'proyectoServicios', 'AdeaServicios', 'tblMisTickets', 'ticketServicios', '$window'];

    function TicketController($log, tblSubProyectos, proyectoServicios, AdeaServicios, tblMisTickets, ticketServicios, $window) {

        var ticketCtrl = this;

        ticketCtrl.tblMisTickets = tblMisTickets;
        ticketCtrl.cambioModo = cambioModo;
        ticketCtrl.seleccionarmiTicket = seleccionarmiTicket;
        ticketCtrl.noHaCambiado = noHaCambiado;
        ticketCtrl.modificarTicket = modificarTicket;
        ticketCtrl.agregarArchivo = agregarArchivo;
        ticketCtrl.consultaArchivosTicket = consultaArchivosTicket;
        ticketCtrl.descargarArchivo = descargarArchivo;
        ticketCtrl.eliminarArchivo = eliminarArchivo;
        ticketCtrl.guardarRelacion = guardarRelacion;
        ticketCtrl.eliminarRelacion = eliminarRelacion;
        ticketCtrl.guardarNota = guardarNota;
        ticketCtrl.editarNota = editarNota;
        ticketCtrl.noHaCambiadoNota = noHaCambiadoNota;
        ticketCtrl.modificaNota = modificaNota;
        ticketCtrl.eliminarNota = eliminarNota;
        ticketCtrl.buscarTicket = buscarTicket;
        
        ticketCtrl.bndArchivos = true;
        ticketCtrl.modoVista = 'C';
        ticketCtrl.bndAdmin = false;
        ticketCtrl.modoGuardar = true;
        
        activar();
        
        function activar() {
        	$log.info('---activar---');
        	consultaUsuario();
        }
        
        function consultaUsuario() {
        	$log.info('---consultaUsuario---');
	        var promesa = AdeaServicios.consultaUsuario().$promise;
	
	        promesa.then(function (respuesta) {
	        	ticketCtrl.usuario = respuesta;
	        	$log.info(ticketCtrl.usuario);
	        	if(ticketCtrl.usuario != null){

	        		var bndPermiso = false;
	        		
	        		angular.forEach(ticketCtrl.usuario.authorities, function (obj1) {	
	        			
	        			if(obj1.authority == 'ADEA-WEB-MANAGER-TICKET_ADM'){
	        				ticketCtrl.bndAdmin = true;
	        			}
	        		});
	        		
	        		consultaTicket(ticketCtrl.usuario.username, 'A', 7);
        			consultaTicket(ticketCtrl.usuario.username, 'R');
        			
	        		if(ticketCtrl.bndAdmin){
	        			consultaTicket(null, 'T', 1);
	        			consultaTicket(null, 'R', 4);
	        		}else{
	        			consultaTicket(ticketCtrl.usuario.username, 'R', 4);
	        		}
	        		
	        	}else{
	        		$location.path('/inicio');
	        	}

	        });
	
	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al consulta el Usuario en Session");
	        });
        }
        
        function consultaTicket(username, tipo, estatus) {
        	$log.info(username+'---'+tipo);
        	var params = {
        			login: username, 
        			tipo: tipo,
        			estatus: estatus
			};
        	
        	
	        var promesa = ticketServicios.consultaTicket(params).$promise;
	
	        promesa.then(function (respuesta) {
	        
	        	
	        	if(respuesta.length > 0){
	        		if(tipo == 'A' && estatus == 7){
	        			ticketCtrl.ticketsAsignados = respuesta;
	        		} else if (tipo == 'R' && (estatus == null || estatus == undefined)){
	        			ticketCtrl.ticketsRegistrados = respuesta;
	        		} else if(tipo == 'T') {
	        			ticketCtrl.ticketsNoAsignados = respuesta;
	        		} else if(tipo == 'R' && estatus == 4) {
	        			ticketCtrl.ticketsResueltas = respuesta;
	        		}
	        		
	        	}else{
	        		AdeaServicios.alerta("error", "El Usuario no tiene tickets");
	        	}

	        });
	
	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al consulta el Usuario en Session");
	        });
        }
        
        function seleccionarmiTicket(reg){
        	ticketCtrl.miTicketSeleccionado = reg;
        	ticketCtrl.miTicketEditable = angular.copy(ticketCtrl.miTicketSeleccionado);
        	ticketCtrl.modoVista = 'M';
        	consultaCategorias();
        	consultaPlantillaArea();
        	consultaPrioridad();
        	consultaPlanta();
        	consultaClientes();
        	consultaEstatus();
        	consultaArchivosTicket();
        	consultaCatRel();
        	consultaRelacionTicket();
        	consultaObservaciones();
        	consultaBitacora();
        }
        
        function buscarTicket(idTicket){
        	
        	var idTicketSel = null;
        	
        	if(idTicket == null || idTicket == '' || idTicket == undefined){
        		idTicketSel = ticketCtrl.idTicketBusqueda;
        	}else{
        		idTicketSel = idTicket;
        	}
        	
        	var params = {
        			idTicket: idTicketSel 
			};
        	
	        var promesa = ticketServicios.consultaTicket(params).$promise;
	
	        promesa.then(function (respuesta) {
	        	if(respuesta.length > 0){
	        		ticketCtrl.miTicketSeleccionado = respuesta[0];
	            	ticketCtrl.miTicketEditable = angular.copy(ticketCtrl.miTicketSeleccionado);
	            	ticketCtrl.modoVista = 'M';
	            	consultaCategorias();
	            	consultaPlantillaArea();
	            	consultaPrioridad();
	            	consultaPlanta();
	            	consultaClientes();
	            	consultaEstatus();
	            	consultaArchivosTicket();
	            	consultaCatRel();
	            	consultaRelacionTicket();
	            	consultaObservaciones();
	            	consultaBitacora();
	            	ticketCtrl.idTicketBusqueda = null;
	        	}else{
	        		AdeaServicios.alerta("error", "El Usuario no tiene tickets");
	        	}
	        });
        	
        }
        
        function cambioModo(modo){
        	ticketCtrl.miTicketSeleccionado = null;
        	ticketCtrl.miTicketEditable = null
        	ticketCtrl.modoVista = modo;
        	ticketCtrl.listCategorias = null;
        }
        
        function consultaPrioridad() {

            var params = {
                keyCatalogo: 'PRIORIDAD_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketCtrl.prioridad = respuesta;

                if (ticketCtrl.prioridad.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
            })


        }
        
        
        function consultaPlanta() {

            var params = {
                keyCatalogo: 'PLANTA',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketCtrl.plantas = respuesta;

                if (ticketCtrl.plantas.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
            })


        }
        
        
        function consultaClientes() {

            var promesa = proyectoServicios.consultaClientesGeneral().$promise;

            promesa.then(function (respuesta) {

            	ticketCtrl.clientes = respuesta;

                if (ticketCtrl.clientes.length == 0) {
                    AdeaServicios.alerta("error", "No existen clientes registrados");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta clientes: " + error.data);
            })


        }
        
        function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
            	ticketCtrl.areasAWM = respuesta;

                if (ticketCtrl.areasAWM.length == 0) {
                    AdeaServicios.alerta("error", "No existen areas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })


        }
        
        function consultaCategorias() {
			 
			 var params = {
					 idArea: ticketCtrl.miTicketSeleccionado.idArea
			 };

	            var promesa = ticketServicios.consultaCategorias(params).$promise;

	            promesa.then(function (respuesta) {
	            	ticketCtrl.listCategorias = respuesta;
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta los clientes");
	            });
	     }
        
        function consultaPlantillaArea(){
        	$log.info("ConsultaPlantilla----")
        	var params = {
                    idArea: ticketCtrl.miTicketSeleccionado.idArea,
                    estatus: "A"
                };

                var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

                promesa.then(function (respuesta) {

                	ticketCtrl.plantillaArea = respuesta;
                		
	                if (ticketCtrl.plantillaArea.length == 0) {
	                	AdeaServicios.alerta("error", "No existen recursos registrados para el area Seleccionada");
	                }

                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
                })
        }
        
        function noHaCambiado(){

        	 var bndCambio = false;

             if (!angular.equals(ticketCtrl.miTicketSeleccionado, ticketCtrl.miTicketEditable)) {
                 bndCambio = true;
             }

             return bndCambio;
        }
        
        
        function consultaEstatus() {

            var params = {
                keyCatalogo: 'ESTATUS_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketCtrl.estatusTicket = respuesta;

                if (ticketCtrl.estatusTicket.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo: " + error.data);
            })


        }
        
        function modificarTicket(){
        	
                var promesa = ticketServicios.modificacionDatosGrl(ticketCtrl.miTicketEditable).$promise;

                promesa.then(function (respuesta) {
                	ticketCtrl.modoVista = 'C';
                	consultaUsuario();
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta el Catalogo: " + error.data);
                })
        }
        
        
        function agregarArchivo(){
        	ticketCtrl.bndArchivos = false;
        	var formData = new FormData();
        	
            formData.append('file', ticketCtrl.archivo);
            formData.append('idTicket', ticketCtrl.miTicketEditable.idTicket);

	        var promesa = ticketServicios.registrarArchivo(formData).$promise;

	        promesa.then(function (respuesta) {
	        	// consultar Archivos
	        	if (respuesta.error == 'ok') {
	        		AdeaServicios.alerta("success", "El archivo se dio de Alta de manera satisfactoria");
	        		ticketCtrl.archivo = null;
	        		ticketCtrl.bndArchivos = true;
	        		consultaArchivosTicket();
	        		consultaBitacora();
	        	}else{
	        		AdeaServicios.alerta("error", respuesta.error);
	        	}
	        	
	        });

	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
	        });
        }
        
        
        function consultaArchivosTicket(){
        	
        	var params = {
        			idTicket: ticketCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaArchivosTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketCtrl.listArchivosTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo: " + error.data);
            })
   
        }     
        
        function descargarArchivo(archivo) {

        	var param = {
        			pcNombre: archivo.nombreArchivo, 
        			pcRuta: archivo.urlArchivo
        	}

            var descarga = ticketServicios.descargarArchivoAdjuntos(param).$promise;

            descarga.then(function (dato) {
            	var blob = dato.response.blob;
            	($window).saveAs(blob, archivo.nombreArchivo);            	
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
               
        }
        
        function eliminarArchivo(archivo){
        	
        	var param = {
        			pcIdArchivoTicket: archivo.idArchivoTicket,
        			pcNombre: archivo.nombreArchivo, 
        			pcRuta: archivo.urlArchivo
        	}

            var promesa = ticketServicios.eliminaAdjunto(param).$promise;

        	promesa.then(function (respuesta) {
        		if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se archivo de borrro de manera satisfactoria");
            		consultaArchivosTicket();
            		consultaBitacora();
            	}else{
            		AdeaServicios.alerta("error", respuesta.error);
            	}
            });
            
        	promesa.catch(function (respuesta) {
            	$log.error(respuesta)
            });
        }
        
        
        function consultaCatRel() {

            var params = {
                keyCatalogo: 'TIPO_REL_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketCtrl.catRel = respuesta;

                if (ticketCtrl.catRel.length == 0) {
                    AdeaServicios.alerta("error", "No existen Opciones dentro del catalogo de relaciones");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de relaciones: " + error.data);
            })


        }
        
        function guardarRelacion(){
        	$log.info('guardarRelacion');
        	var relacion = {
        			idTicketRel: ticketCtrl.idTicket,
        			codigoRelacion: ticketCtrl.relacion,
        			idTicket: ticketCtrl.miTicketEditable.idTicket
        	};

            var promesa = ticketServicios.registraRelacionTicket(relacion).$promise;

            promesa.then(function (respuesta) {
            	
            	if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se registro la Relación de manera satisfactoria");
            		consultaRelacionTicket();
            		ticketCtrl.idTicket = null;
            		ticketCtrl.relacion = null;
            		consultaBitacora();
            	}else{
            		$log.info('debe mostrar esto');
            		AdeaServicios.alerta("error", respuesta.error);
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al registrar la Relación: " + error.data);
            })
        }
        
        
        function consultaRelacionTicket(){
        	
        	var params = {
        			idTicket: ticketCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaRelacionTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketCtrl.listRelacionTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            })
   
        }
        
        function eliminarRelacion(idTicketRelacion){
        	
        	var params = {
        			idTicketRelacion: idTicketRelacion
        	};
        	
            var promesa = ticketServicios.eliminaTicketRelacion(params).$promise;

            promesa.then(function (respuesta) {
            	if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se elimino de manera correcta la Relación seleccionada");
            		consultaRelacionTicket();
            		consultaBitacora();
            	}else{
            		 AdeaServicios.alerta("error", "Error al eliminar la Relacion del Ticket: " + respuesta.error);
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            })
        	
        }
        
        function guardarNota(){
        	var params = {
        			observacion: ticketCtrl.nota,
        			idTicket: ticketCtrl.miTicketEditable.idTicket

        	};
        	
            var promesa = ticketServicios.guardarNotaTicket(params).$promise;

            promesa.then(function (respuesta) {
            	if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se guardo correctamente la Nota");
            		consultaObservaciones();
            		ticketCtrl.nota = null;
            		consultaBitacora();
            	}else{
            		 AdeaServicios.alerta("error", "Error al guardar la nota: " + respuesta.error);
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            })
        }
        
 
        function consultaObservaciones(){
        	
        	var params = {
        			idTicket: ticketCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaObservaciones(params).$promise;

            promesa.then(function (respuesta) {
            	ticketCtrl.listNotasTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las notas del Ticket: " + error.data);
            })
   
        }
        
        function editarNota(notaSeleccionada){
        	$log.info('editarNota');
        	$log.info(notaSeleccionada);
        	ticketCtrl.notaSeleccionada = angular.copy(notaSeleccionada);
        	ticketCtrl.nota = notaSeleccionada.observacion;
            ticketCtrl.modoGuardar = false;
        }
        
        function noHaCambiadoNota(){
        	var bndCambio = false;
        	if(ticketCtrl.notaSeleccionada.observacion != ticketCtrl.nota){
        		bndCambio = true;
        	}
        	
        	return bndCambio;
        }
        
        function modificaNota(){
        	
        	var param = {
        			idObservacionesTicket: ticketCtrl.notaSeleccionada.idObservacionesTicket,
        			observacion: ticketCtrl.nota
        	}
        	
            var promesa = ticketServicios.modificaNotaTicket(param).$promise;

            promesa.then(function (respuesta) {
            	if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se guardo correctamente la Nota");
            		consultaObservaciones();
            		ticketCtrl.nota = null;
            		consultaBitacora();
            	}else{
            		 AdeaServicios.alerta("error", "Error al guardar la nota: " + respuesta.error);
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            })
        }
        
        function eliminarNota(idObservacionTicket){
        	
        	var params = {
        			idObservacionTicket: idObservacionTicket
        	};
        	
            var promesa = ticketServicios.eliminarNota(params).$promise;

            promesa.then(function (respuesta) {
            	if (respuesta.error == 'ok') {
            		AdeaServicios.alerta("success", "Se elimino de manera correcta la Nota seleccionada");
            		consultaObservaciones();
            		consultaBitacora();
            	}else{
            		 AdeaServicios.alerta("error", "Error al eliminar la Nota del Ticket: " + respuesta.error);
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al registrar la Nota del Ticket: " + error.data);
            })
        }
        
        function consultaBitacora(){
        	
        	var params = {
        			idTicket: ticketCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaLogTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketCtrl.listLogTicket = respuesta;
            });

            promesa.catch(function (error) {
            	$log.info(error);
                AdeaServicios.alerta("error", "Error al consulta la Bitacora del Ticket: " + error.data);
            })
   
        }
        
    }
})
();

