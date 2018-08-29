(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:editarTickets
     * @scope
     * @restrict E
     * @description Directiva que se encarga de la búsqueda del ticket
     */
    angular
            .module('adeaDirectivas')
            .controller('editarTicketController', editarTicketController)
            .directive('editarTicket', editarTicket);

    editarTicket.$inject = ['$log'];
    editarTicketController.$inject = ['$log', '$scope', '$timeout', 'AdeaServicios', 'tableroServicios', 'ticketServicios', 'proyectoServicios', '$window', '$filter'];

    function editarTicketController($log, $scope, $timeout, AdeaServicios, tableroServicios, ticketServicios, proyectoServicios, $window, $filter) {

        var editarTicketsCtrl = this;
        editarTicketsCtrl.editarTicket = editarTicket;
        editarTicketsCtrl.noHaCambiado = noHaCambiado;
        editarTicketsCtrl.comboarea_action = comboarea_action;
        editarTicketsCtrl.modificarTicket = modificarTicket;
        editarTicketsCtrl.idticket = $scope.idticket;
        editarTicket($scope.idticket);

        function editarTicket(idTicket) {
            $log.info("editarTicket----");
            $log.info(idTicket);

            if (idTicket == null || idTicket == '' || idTicket == undefined) {
                return null;
            }

            var params = {
                idTicket: idTicket
            };

            var promesa = ticketServicios.consultaTicket(params).$promise;

            promesa.then(function (respuesta) {
                if (respuesta.length > 0) {
                    editarTicketsCtrl.miTicketSeleccionado = respuesta[0];
                    editarTicketsCtrl.miTicketEditable = angular.copy(editarTicketsCtrl.miTicketSeleccionado);
                    editarTicketsCtrl.beditar = false;

                    $log.info("editarTicketsCtrl.miTicketEditable.estatus");
                    $log.info(editarTicketsCtrl.miTicketEditable.estatus);

                    if (editarTicketsCtrl.miTicketEditable.estatus != 6) {
                        editarTicketsCtrl.beditar = true;
                    }
                    consultaAreasAwm();
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
                } else {
                    AdeaServicios.alerta("error", "El usuario no tiene tickets");
                }
            });
        }

        function comboarea_action() {
            consultaCategorias();
            consultaPlantillaArea();
        }

        function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.areaslist = respuesta;

                if (editarTicketsCtrl.areaslist.length == 0) {
                    AdeaServicios.alerta("error", "No existen áreas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar las áreas de Adea: " + error.data);
            });

        }

        function consultaCategorias() {
            $log.info("consultaCategorias----");

            var params = {
                idArea: editarTicketsCtrl.miTicketEditable.idArea
            };

            var promesa = ticketServicios.consultaCategorias(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.listCategorias = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los clientes");
            });
        }

        function consultaPlantillaArea() {
            $log.info("consultaPlantillaArea----");

            var params = {
                idArea: editarTicketsCtrl.miTicketEditable.idArea,
                estatus: "A"
            };

            var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.plantillaArea = respuesta;

                if (editarTicketsCtrl.plantillaArea.length == 0) {
                    AdeaServicios.alerta("error", "No existen recursos registrados para el area seleccionada");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los recuros del área: " + error.data);
            });
        }

        function consultaPrioridad() {
            $log.info("consultaPrioridad----");

            var params = {
                keyCatalogo: 'PRIORIDAD_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                editarTicketsCtrl.prioridad = respuesta;

                if (editarTicketsCtrl.prioridad.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
            });

        }

        function consultaPlanta() {
            $log.info("consultaPlanta----");

            var params = {
                keyCatalogo: 'PLANTA',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                editarTicketsCtrl.plantas = respuesta;

                if (editarTicketsCtrl.plantas.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo de prioridad");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de prioridad: " + error.data);
            });
        }


        function consultaClientes() {
            $log.info("consultaClientes----");

            var promesa = proyectoServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {

                editarTicketsCtrl.clientes = respuesta;

                if (editarTicketsCtrl.clientes.length == 0) {
                    AdeaServicios.alerta("error", "No existen clientes registrados");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta clientes: " + error.data);
            });

        }

        function consultaEstatus() {
            $log.info("consultaEstatus----");

            var params = {
                keyCatalogo: 'ESTATUS_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                editarTicketsCtrl.estatusTicket = respuesta;

                if (editarTicketsCtrl.estatusTicket.length == 0) {
                    AdeaServicios.alerta("error", "No existen Estatus dentro del catalogo");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo: " + error.data);
            });
        }

        function consultaArchivosTicket() {
            $log.info("consultaArchivosTicket----");

            var params = {
                idTicket: editarTicketsCtrl.miTicketEditable.idTicket
            };

            var promesa = ticketServicios.consultaArchivosTicket(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.listArchivosTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Archivo: " + error.data);
            });
        }

        function consultaCatRel() {
            $log.info("consultaCatRel----");

            var params = {
                keyCatalogo: 'TIPO_REL_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                editarTicketsCtrl.catRel = respuesta;

                if (editarTicketsCtrl.catRel.length == 0) {
                    AdeaServicios.alerta("error", "No existen Opciones dentro del catalogo de relaciones");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de relaciones: " + error.data);
            });
        }

        function consultaRelacionTicket() {
            $log.info("consultaRelacionTicket----");

            var params = {
                idTicket: editarTicketsCtrl.miTicketEditable.idTicket
            };

            var promesa = ticketServicios.consultaRelacionTicket(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.listRelacionTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Relaciones del Ticket: " + error.data);
            });

        }

        function consultaObservaciones() {
            $log.info("consultaObservaciones----");

            var params = {
                idTicket: editarTicketsCtrl.miTicketEditable.idTicket
            };

            var promesa = ticketServicios.consultaObservaciones(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.listNotasTicket = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las notas del Ticket: " + error.data);
            });

        }

        function consultaBitacora() {
            $log.info("consultaBitacora----");

            var params = {
                idTicket: editarTicketsCtrl.miTicketEditable.idTicket
            };

            var promesa = ticketServicios.consultaLogTicket(params).$promise;

            promesa.then(function (respuesta) {
                editarTicketsCtrl.listLogTicket = respuesta;
                editarTicketsCtrl.listLogTicket = $filter('ordenarListMilisTickets')(editarTicketsCtrl.listLogTicket);
            });

            promesa.catch(function (error) {
                $log.info(error);
                AdeaServicios.alerta("error", "Error al consulta la Bitacora del Ticket: " + error.data);
            });
        }
                
        function noHaCambiado() {
            var bndCambio = false;
            if (!angular.equals(editarTicketsCtrl.miTicketSeleccionado, editarTicketsCtrl.miTicketEditable)) {
                bndCambio = true;
            }

            return bndCambio;
        }
        
        function modificarTicket() {
            $log.info("modificarTicket -- editarTicket.directive ----");
            var promesa = ticketServicios.modificacionDatosGrl(editarTicketsCtrl.miTicketEditable).$promise;

            promesa.then(function (respuesta) {
               AdeaServicios.alerta("success", "El ticket se actualizó correctamente.");
               $scope.modificarTicket(); 
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al modificar el ticket: " + error.data);
            });
        }

    }


    function editarTicket() {
        var directiva = {
            controller: editarTicketController,
            restrict: 'E',
            controllerAs: 'editarTicketsCtrl',
            transclude: false,
            scope: {
                idticket: '=',
                modificarTicket: '&'
            },
            templateUrl: 'app/directivas/editarTicket/editarTicket.html'
        };
        return directiva;
    }

})();
