(function() {
	'use strict';

	angular.module('adeaModule').controller('ReportarTicketController',
			ReportarTicketController);

	ReportarTicketController.$inject = [ '$log', 'tblSubProyectos',
			'proyectoServicios', 'AdeaServicios', 'tblMisTickets',
			'ticketServicios', 'serviceUrl' ];

	function ReportarTicketController($log, tblSubProyectos, proyectoServicios,
			AdeaServicios, tblMisTickets, ticketServicios, serviceUrl) {

		var reportarTicketCtrl = this;
		
		
		reportarTicketCtrl.agregarTicket = agregarTicket;
		reportarTicketCtrl.consultaCategorias = consultaCategorias;
		reportarTicketCtrl.cambiarModo = cambiarModo;
		reportarTicketCtrl.consultaPlantillaArea = consultaPlantillaArea;
		reportarTicketCtrl.consultaDatosArea = consultaDatosArea;
		
		reportarTicketCtrl.urlServicio =  serviceUrl + "ticket/registrarTicket.action";
		reportarTicketCtrl.modo = 'R';
		
		activar();
		
		
		function activar() {
        	consultaPrioridad();
        	consultaPlanta();
        	consultaAreasAwm();
        	consultaClientes();
        }
		
		
		function consultaDatosArea(){
			consultaCategorias();
			consultaPlantillaArea();
		}
		
		
		function consultaCategorias() {
			 
			 var params = {
					 idArea: reportarTicketCtrl.ticketNuevo.idArea
			 };

	            var promesa = ticketServicios.consultaCategorias(params).$promise;

	            promesa.then(function (respuesta) {
	            	reportarTicketCtrl.listCategorias = respuesta;
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta los clientes");
	            });
	     }
	        
	        
	    function consultaPrioridad() {

	            var params = {
	                keyCatalogo: 'PRIORIDAD_TICKET',
	                scltcod: 2,
	                claveCat: null
	            };

	            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

	            promesa.then(function (respuesta) {

	            	reportarTicketCtrl.prioridad = respuesta;

	                if (reportarTicketCtrl.prioridad.length == 0) {
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

	            	reportarTicketCtrl.plantas = respuesta;

	                if (reportarTicketCtrl.plantas.length == 0) {
	                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
	                }
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
	            });


	        }
	        

	        function consultaClientes() {
	        	
	        	var params = {estatus: 'A'};
	        	
	            var promesa = proyectoServicios.consultaClientesGeneral(params).$promise;

	            promesa.then(function (respuesta) {

	            	reportarTicketCtrl.clientes = respuesta;

	                if (reportarTicketCtrl.clientes.length == 0) {
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
	            	reportarTicketCtrl.areasAWM = respuesta;

	                if (reportarTicketCtrl.areasAWM.length == 0) {
	                    AdeaServicios.alerta("error", "No existen areas registradas");
	                }
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
	            })


	        }
	        
	        function agregarTicket(){
	        	
	        	var formData = new FormData();
	        	
	        	if(reportarTicketCtrl.archivo != null && reportarTicketCtrl.archivo != undefined){
	        		formData.append('file', reportarTicketCtrl.archivo);
	        	}
	        	
	        	formData.append('idCliente', reportarTicketCtrl.ticketNuevo.idCliente);
	        	formData.append('categoria', reportarTicketCtrl.ticketNuevo.categoria);
	        	formData.append('prioridad', reportarTicketCtrl.ticketNuevo.prioridad);
	        	formData.append('idArea', reportarTicketCtrl.ticketNuevo.idArea);
	        	formData.append('resumen', reportarTicketCtrl.ticketNuevo.resumen);
	        	formData.append('extension', reportarTicketCtrl.ticketNuevo.extension);
	        	formData.append('planta', reportarTicketCtrl.ticketNuevo.planta);
	        	formData.append('usuarioAsignado', reportarTicketCtrl.ticketNuevo.usuarioAsignado);
	        	formData.append('descripcion', reportarTicketCtrl.ticketNuevo.descripcion);
	        	

		        var promesa = ticketServicios.registrarTicket(formData).$promise;

		        promesa.then(function (respuesta) {
		        	reportarTicketCtrl.ticket = respuesta;
		        	reportarTicketCtrl.modo = 'E';
		        	reportarTicketCtrl.ticketNuevo = null;
		        	reportarTicketCtrl.archivo = null;
		        });

		        promesa.catch(function (error) {
		            AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
		        });
	        }
	        
	        function cambiarModo(){
	        	$log.info('cambio de Modo');
	        	reportarTicketCtrl.modo = 'R';
	        }
	        
	        function consultaPlantillaArea(){
	        	$log.info("ConsultaPlantilla----")
	        	var params = {
	                    idArea: reportarTicketCtrl.ticketNuevo.idArea,
	                    estatus: "A"
	                };

	                var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

	                promesa.then(function (respuesta) {

	                	reportarTicketCtrl.plantillaArea = respuesta;
	                		
		                if (reportarTicketCtrl.plantillaArea.length == 0) {
		                	AdeaServicios.alerta("error", "No existen recursos registrados para el area Seleccionada");
		                }

	                });

	                promesa.catch(function (error) {
	                    AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
	                })
	        }
	        

	}
})();