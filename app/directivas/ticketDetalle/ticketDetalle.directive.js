(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas').controller('TicketDetalle', TicketDetalle)
			.directive('ticketDetalle', ticketDetalle);

	TicketDetalle.$inject = [ '$log', '$scope', 'AdeaServicios', '$filter', '$compile', '$window', 'proyectoServicios', 'ticketServicios' ];

	function TicketDetalle($log, $scope, AdeaServicios, $filter, $compile, $window, proyectoServicios, ticketServicios ) {

		var ticketDetalleCtrl = this;
		
		ticketDetalleCtrl.consultaProyectos = consultaProyectos;
		ticketDetalleCtrl.bndModo = false;
		ticketDetalleCtrl.bndArchivos = true;
		ticketDetalleCtrl.agregarArchivo = agregarArchivo; 
		ticketDetalleCtrl.descargarArchivo = descargarArchivo;
		
		buscarTicket();
		
		

		function buscarTicket() {
			
			if($scope.modo == 'C'){
				ticketDetalleCtrl.bndModo = true;
			}

			ticketDetalleCtrl.miTicketEditable = null;

			var params = {
				idTicket : $scope.idTicket
			};

			var promesa = ticketServicios.consultaTicket(params).$promise;

			promesa.then(function(respuesta) {
				if (respuesta.length > 0) {
					ticketDetalleCtrl.miTicketSeleccionado = respuesta[0];
					ticketDetalleCtrl.miTicketEditable = angular.copy(respuesta[0]);
					consultaAreasAwm();
					consultaCategorias();
					consultaPlantillaArea();
					consultaPrioridad();
					consultaPlanta();
					consultaClientes();
					consultaEstatusbyEstatus();
					consultaArchivosTicket();
					consultaCatRel();
					consultaRelacionTicket();
					consultaObservaciones();
					consultaBitacora();
					ticketDetalleCtrl.idTicketBusqueda = null;
					ticketDetalleCtrl.consultaProyectos(ticketDetalleCtrl.miTicketEditable.idCliente);
				} else {
					AdeaServicios.alerta("error", "No existe el ticket con el numero indicado");
				}
			});

		}
		
		function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
            	ticketDetalleCtrl.areasAWM = respuesta;

                if (ticketDetalleCtrl.areasAWM.length == 0) {
                    AdeaServicios.alerta("error", "No existen areas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })

        }
		
		function consultaCategorias() {
			 
			 var params = {
					 idArea: ticketDetalleCtrl.miTicketEditable.idArea
			 };

	            var promesa = ticketServicios.consultaCategorias(params).$promise;

	            promesa.then(function (respuesta) {
	            	ticketDetalleCtrl.listCategorias = respuesta;
	            });

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al consulta los clientes");
	            });
	     }
		
		
		function consultaPlantillaArea(){
        	$log.info("ConsultaPlantilla----")
        	var params = {
                    idArea: ticketDetalleCtrl.miTicketSeleccionado.idArea,
                    estatus: "A"
                };

                var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

                promesa.then(function (respuesta) {

                	ticketDetalleCtrl.plantillaArea = respuesta;
                		
	                if (ticketDetalleCtrl.plantillaArea.length == 0) {
	                	AdeaServicios.alerta("error", "No existen recursos registrados para el area Seleccionada");
	                }

                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta los recuros del Area: " + error.data);
                })
        }
		
		
		function consultaPrioridad() {

            var params = {
                keyCatalogo: 'PRIORIDAD_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketDetalleCtrl.prioridad = respuesta;

                if (ticketDetalleCtrl.prioridad.length == 0) {
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

            	ticketDetalleCtrl.plantas = respuesta;

                if (ticketDetalleCtrl.plantas.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
            })


        }
        
        function consultaClientes() {
           	
            var promesa = proyectoServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {

            	ticketDetalleCtrl.clientes = respuesta;

                if (ticketDetalleCtrl.clientes.length == 0) {
                    AdeaServicios.alerta("error", "No existen clientes registrados");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta clientes: " + error.data);
            })
        }
        
        
        function consultaEstatusbyEstatus() {

            var params = {
                estatus: ticketDetalleCtrl.miTicketSeleccionado.estatus
            };

            var promesa = ticketServicios.consultaEstatus(params).$promise;

            promesa.then(function (respuesta) {

            	ticketDetalleCtrl.estatusTicket = respuesta;

                if (ticketDetalleCtrl.estatusTicket.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo: " + error.data);
            })

        }
        
        function consultaArchivosTicket(){
        	
        	var params = {
        			idTicket: ticketDetalleCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaArchivosTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketDetalleCtrl.listArchivosTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Archivo: " + error.data);
            })
        }  
        
        function consultaCatRel() {

            var params = {
                keyCatalogo: 'TIPO_REL_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

            	ticketDetalleCtrl.catRel = respuesta;

                if (ticketDetalleCtrl.catRel.length == 0) {
                    AdeaServicios.alerta("error", "No existen Opciones dentro del catalogo de relaciones");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de relaciones: " + error.data);
            })
        }
        
        function consultaRelacionTicket(){
        	
        	var params = {
        			idTicket: ticketDetalleCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaRelacionTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketDetalleCtrl.listRelacionTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            })
   
        }
        
        function consultaObservaciones(){
        	
        	var params = {
        			idTicket: ticketDetalleCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaObservaciones(params).$promise;

            promesa.then(function (respuesta) {
            	ticketDetalleCtrl.listNotasTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las notas del Ticket: " + error.data);
            })
        }
        
        function consultaBitacora(){
        	
        	var params = {
        			idTicket: ticketDetalleCtrl.miTicketEditable.idTicket
        	};
        	
            var promesa = ticketServicios.consultaLogTicket(params).$promise;

            promesa.then(function (respuesta) {
            	ticketDetalleCtrl.listLogTicket = respuesta;
            	ticketDetalleCtrl.listLogTicket = $filter('ordenarListMilisTickets')(ticketDetalleCtrl.listLogTicket);
            });

            promesa.catch(function (error) {
            	$log.info(error);
                AdeaServicios.alerta("error", "Error al consulta la Bitacora del Ticket: " + error.data);
            })
   
        }
        
        function consultaProyectos(idCliente) {
        	ticketDetalleCtrl.listProyectos = [];

            if (AdeaServicios.validarDato(idCliente)) {

                var params = {pidCliente: idCliente};

                var promesa = proyectoServicios.consultaProyecto(params).$promise;

                promesa.then(function (respuesta) {
                	ticketDetalleCtrl.listProyectos = respuesta;


                    if (ticketDetalleCtrl.listProyectos.length == 0) {
                        AdeaServicios.alerta("error", "No existen Proyectos del cliente seleccionado");
                    }
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consulta de Proyectos: " + error.data.error);
                })
            }
        }
        
        function agregarArchivo(){
        	ticketDetalleCtrl.bndArchivos = false;
        	var formData = new FormData();
        	
            formData.append('file', ticketDetalleCtrl.archivo);
            formData.append('idTicket', ticketDetalleCtrl.miTicketEditable.idTicket);

	        var promesa = ticketServicios.registrarArchivo(formData).$promise;

	        promesa.then(function (respuesta) {
	        	// consultar Archivos
	        	if (respuesta.error == 'ok') {
	        		AdeaServicios.alerta("success", "El archivo se dio de Alta de manera satisfactoria");
	        		consultaArchivosTicket();
	        		consultaBitacora();
	        		ticketDetalleCtrl.archivo = null;
	        		ticketDetalleCtrl.bndArchivos = true;
	        	}else{
	        		$log.info('error al guardar en la ruta');
	        		AdeaServicios.alerta("error", respuesta.error);
	        		ticketDetalleCtrl.bndArchivos = true;
	        		ticketDetalleCtrl.archivo = null;
	        	}
	        	
	        });

	        promesa.catch(function (error) {
	            AdeaServicios.alerta("error", "Error al guardar Archivo: " + error.data);
	        });
        }
        
        function descargarArchivo(archivo) {

        	var param = {
        			pcNombre: archivo.nombreArchivo, 
        			pcRuta: archivo.urlArchivo
        	}

            var descarga = ticketServicios.descargarArchivoAdjuntos(param).$promise;

            descarga.then(function (dato) {
            	$log.info(dato.response.blob.size);
            	
            	if(dato.response.blob.size > 0){
            		var blob = dato.response.blob;
            		($window).saveAs(blob, archivo.nombreArchivo);
            	}else{
            		AdeaServicios.alerta("error", "Error al descargar el Archivo: el archivo no existe o esta dañado");
            	}
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
               
        }
	}

	ticketDetalle.$inject = [ '$log' ];
	function ticketDetalle() {
		var directiva = {
			controller : TicketDetalle,
			restrict : 'E',
			controllerAs : 'ticketDetalleCtrl',
			transclude : true,
			scope : {
				idTicket : '=',
				modo : '=?'
			},
			templateUrl : 'app/directivas/ticketDetalle/ticketDetalle.html'
		};

		return directiva;
	}
})();
