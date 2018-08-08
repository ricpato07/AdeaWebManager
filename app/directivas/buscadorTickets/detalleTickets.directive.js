(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:detalleTickets
     * @scope
     * @restrict E
     * @description Directiva que se encarga de la búsqueda del ticket
     */
    angular
            .module('adeaDirectivas')
            .controller('detalleTicketsController', detalleTicketsController)
            .directive('detalleTickets', detalleTickets);

    detalleTickets.$inject = ['$log'];
    detalleTicketsController.$inject = ['$log', '$scope', '$timeout', 'AdeaServicios', 'tableroServicios', 'ticketServicios', 'proyectoServicios', '$window','$filter'];

    function detalleTicketsController($log, $scope, $timeout, AdeaServicios, tableroServicios, ticketServicios, proyectoServicios, $window, $filter) {

        var detalleTicketCtrl = this;
        detalleTicketCtrl.buscarTicket = buscarTicket;
        detalleTicketCtrl.regresar = regresar;
        detalleTicketCtrl.asignado_change = asignado_change;
        detalleTicketCtrl.asignar_ticket = asignar_ticket;
        detalleTicketCtrl.combo_estado = combo_estado;
        detalleTicketCtrl.cambiar_estado = cambiar_estado;
        detalleTicketCtrl.descargarArchivo = descargarArchivo;
        detalleTicketCtrl.idticketbusqueda = $scope.idticketbusqueda;
        detalleTicketCtrl.bbuscar = $scope.bbuscar;
        detalleTicketCtrl.usuario = $scope.usuario;
        detalleTicketCtrl.perfil = $scope.perfil;
        detalleTicketCtrl.miTicket = {};
        detalleTicketCtrl.fechaEntrega = {};
        detalleTicketCtrl.fechaEntrega.minDate = new Date();
        detalleTicketCtrl.tiempoAtencion = new Date(1900, 1, 1);

        buscarTicket();

        function buscarTicket() {

            $log.info("buscarTicket directive");
            $log.info(detalleTicketCtrl.idticketbusqueda);
            $log.info(detalleTicketCtrl.usuario);
            $log.info(detalleTicketCtrl.perfil);

            $scope.idticketbusqueda = undefined;

            if (detalleTicketCtrl.idticketbusqueda == undefined) {
                return null;
            }

            var idTicket = Number(detalleTicketCtrl.idticketbusqueda);

            var params = {
                idTicket: idTicket
            };

            detalleTicketCtrl.bbusquedacorrecta = false;
            detalleTicketCtrl.bbusquedaincorrecta = false;


            //detalleTicketCtrl.beditar = true;
//            detalleTicketCtrl.bbusquedacorrecta = true;
//            detalleTicketCtrl.miTicket.usuarioAsignado = "Ricardo García Uribe";
//            detalleTicketCtrl.miTicket = {};
//            detalleTicketCtrl.miTicket.tiempoAtencion = detalleTicketCtrl.tiempoAtencion;
//            detalleTicketCtrl.miTicket.nombreArea = "Desarrollo";


            var promesa = tableroServicios.getTicket(params).$promise;

            promesa.then(function (respuesta) {
                $log.info("detalleTicketCtrl.miTicket");
                $log.info(respuesta);

                if (respuesta.idTicket == null) {
                    detalleTicketCtrl.bbusquedaincorrecta = true;
                    $log.info(detalleTicketCtrl.bbusquedacorrecta);
                    $log.info(detalleTicketCtrl.bbusquedaincorrecta);
                    return null;
                }

                detalleTicketCtrl.miTicket = respuesta;
                detalleTicketCtrl.bbusquedacorrecta = true;

                if (detalleTicketCtrl.miTicket.tiempoAtencion == null) {
                    detalleTicketCtrl.miTicket.tiempoAtencion = detalleTicketCtrl.tiempoAtencion;
                }


                if (detalleTicketCtrl.miTicket.estatus == "6") {
                    detalleTicketCtrl.beditar = false;
                } else {
                    detalleTicketCtrl.beditar = true;
                    if (detalleTicketCtrl.perfil != "8") {
                        if (detalleTicketCtrl.miTicket.usuarioAsignado != detalleTicketCtrl.usuario) {
                            detalleTicketCtrl.beditar = false;
                        }
                    }
                }
                $log.info(detalleTicketCtrl.bbusquedacorrecta);
                $log.info(detalleTicketCtrl.bbusquedaincorrecta);
                cargar_consultas();
                asignado_change();
                combo_estado();
            });

            promesa.catch(function (error) {
                $log.error(error);
                detalleTicketCtrl.bbusquedaincorrecta = true;
                AdeaServicios.alerta("error", "Error al buscar el ticket");
            });

        }

        function regresar() {
            detalleTicketCtrl.bbuscar = false;
            $scope.bbuscar = false;
            $scope.regresar();
        }

        detalleTicketCtrl.abrirFechaEntrega = function () {

            $log.info(detalleTicketCtrl.fechaEntrega.minDate);
            detalleTicketCtrl.fechaEntrega.abierto = true;
        };

        function asignado_change() {
            $log.info("asignado_change");

            $log.info(detalleTicketCtrl.miTicket.usuarioAsignado);
            if (detalleTicketCtrl.miTicket.usuarioAsignado != undefined) {
                var params = {
                    user: detalleTicketCtrl.miTicket.usuarioAsignado
                };

                var promesa = tableroServicios.getUltimoTicketEntrega(params).$promise;

                promesa.then(function (respuesta) {
                    $log.info(respuesta);
                    detalleTicketCtrl.ultimoticketlist = respuesta;
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consultar");
                });
            }
        }

        function asignar_ticket() {
            $log.info("asignar_ticket");

            if (detalleTicketCtrl.miTicket.complejidad == undefined || detalleTicketCtrl.miTicket.complejidad == null) {
                AdeaServicios.alerta("error", "Es necesario seleccionar la complejidad");
                return null;
            }
            $log.info(detalleTicketCtrl.miTicket.tiempoAtencion);
            $log.info(typeof detalleTicketCtrl.miTicket.tiempoAtencion);


            var tiempoAtencion;
            if (typeof detalleTicketCtrl.miTicket.tiempoAtencion == 'number') {
                tiempoAtencion = new Date(detalleTicketCtrl.miTicket.tiempoAtencion);
            } else {
                tiempoAtencion = detalleTicketCtrl.miTicket.tiempoAtencion;
            }

            if (tiempoAtencion.getHours() == 0 && tiempoAtencion.getMinutes() == 0) {
                AdeaServicios.alerta("error", "Debes colocar el tiempo estimado de atención");
                return null;
            }

            if (detalleTicketCtrl.miTicket.fechaEntrega == undefined || detalleTicketCtrl.miTicket.fechaEntrega == null) {
                AdeaServicios.alerta("error", "Debes colocar la fecha estimada de entrega");
                return null;
            }
            if (detalleTicketCtrl.miTicket.usuarioAsignado == undefined || detalleTicketCtrl.miTicket.usuarioAsignado == null) {
                AdeaServicios.alerta("error", "Debes colocar al usuario al que se le asignará el ticket");
                return null;
            }


            var promesa = tableroServicios.updateAsignarTicket(detalleTicketCtrl.miTicket).$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);
                AdeaServicios.alerta("success", "Ticket asignado correctamente");
                detalleTicketCtrl.idticketbusqueda = detalleTicketCtrl.miTicket.idTicket;
                buscarTicket();
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al asignar ticket");
            });
        }

        function combo_estado() {
            detalleTicketCtrl.bcambiar_estado = true;
            if (detalleTicketCtrl.miTicket.estatus == undefined || detalleTicketCtrl.miTicket.estatus == null || detalleTicketCtrl.miTicket.estatus == '7') {
                detalleTicketCtrl.bcambiar_estado = false;
            }
        }

        function cambiar_estado() {
            if (detalleTicketCtrl.miTicket.estatus == undefined || detalleTicketCtrl.miTicket.estatus == null) {
                AdeaServicios.alerta("error", "Es necesario seleccionar el estado");
                return null;
            }
            var promesa = tableroServicios.updateEstadoTicket(detalleTicketCtrl.miTicket).$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);
                if (detalleTicketCtrl.nota != undefined && detalleTicketCtrl.nota != null) {
                    guardarNota();
                }
                AdeaServicios.alerta("success", "Estado actualizado correctamente");
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al cambiar el estado");
            });

        }


        function cargar_consultas() {
            consultaComplejidad();
            consultaPlantillaArea();
            consultaEstatus();
            consultaArchivosTicket();
            consultaObservaciones();
            consultaBitacora();
        }


        function consultaComplejidad() {
            $log.info("ConsultaComplejidad-------");

            var promesa = tableroServicios.getComplejidad().$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);
                detalleTicketCtrl.complejidadlist = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar la complejidad");
            });
        }

        function consultaPlantillaArea() {
            $log.info("ConsultaPlantilla----");
            var params = {
                idArea: detalleTicketCtrl.miTicket.idArea,
                estatus: "A"
            };

            var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

            promesa.then(function (respuesta) {

                detalleTicketCtrl.plantillaArea = respuesta;

                if (detalleTicketCtrl.plantillaArea.length == 0) {
                    AdeaServicios.alerta("error", "No existen recursos registrados para el area seleccionada");
                }

            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los recursos del área: " + error.data);
            });
        }

        function consultaEstatus() {

            var params = {
                keyCatalogo: 'ESTATUS_TICKET',
                scltcod: 2,
                claveCat: null
            };

            detalleTicketCtrl.estatusTicket = [];

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                if (respuesta.length == 0) {
                    AdeaServicios.alerta("error", "No existen estatus dentro del catálogo");
                    return null;
                }
                detalleTicketCtrl.estatusTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar el catálogo: " + error.data);
            });

        }

        function consultaArchivosTicket() {
            $log.info("ConsultaArchivosTicket----");
            var params = {
                idTicket: detalleTicketCtrl.miTicket.idTicket
            };

            var promesa = ticketServicios.consultaArchivosTicket(params).$promise;

            promesa.then(function (respuesta) {
                detalleTicketCtrl.listArchivosTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los archivos del ticket: " + error.data);
            });
        }

        function consultaObservaciones() {
            $log.info("ConsultaObservacionesTicket----");

            var params = {
                idTicket: detalleTicketCtrl.miTicket.idTicket
            };

            var promesa = ticketServicios.consultaObservaciones(params).$promise;

            promesa.then(function (respuesta) {
                detalleTicketCtrl.listNotasTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las notas del Ticket: " + error.data);
            });

        }

        function consultaBitacora() {

            $log.info("ConsultaBitacora---");

            var params = {
                idTicket: detalleTicketCtrl.miTicket.idTicket
            };

            var promesa = ticketServicios.consultaLogTicket(params).$promise;

            promesa.then(function (respuesta) {
                if (respuesta != undefined) {
                    detalleTicketCtrl.listLogTicket = $filter('ordenarListMilisTickets')(respuesta);
                } else {
                    detalleTicketCtrl.listLogTicket = undefined;
                }
            });


            promesa.catch(function (error) {
                $log.info(error);
                AdeaServicios.alerta("error", "Error al consulta la Bitacora del Ticket: " + error.data);
            });
        }

        function guardarNota() {
            var params = {
                observacion: detalleTicketCtrl.nota,
                idTicket: detalleTicketCtrl.miTicket.idTicket
            };

            var promesa = ticketServicios.guardarNotaTicket(params).$promise;

            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    consultaObservaciones();
                    detalleTicketCtrl.nota = null;
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "Error al guardar la nota: " + respuesta.error);
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al guardar la nota: " + error.data);
            });
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

    }


    function detalleTickets() {
        var directiva = {
            controller: detalleTicketsController,
            restrict: 'E',
            controllerAs: 'detalleTicketCtrl',
            transclude: false,
            scope: {
                idticketbusqueda: '=',
                regresar: '&',
                bbuscar: '=',
                bbusquedacorrecta: '=',
                usuario: '=',
                perfil: '='
            },
            templateUrl: 'app/directivas/buscadorTickets/detalleTicket.html'
        };
        return directiva;
    }

})();
