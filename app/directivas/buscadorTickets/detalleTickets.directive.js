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
    detalleTicketsController.$inject = ['$log', '$scope', '$timeout', 'AdeaServicios', 'tableroServicios'];

    function detalleTicketsController($log, $scope, $timeout, AdeaServicios, tableroServicios) {

        var detalleTicketCtrl = this;
        detalleTicketCtrl.buscarTicket = buscarTicket;
        detalleTicketCtrl.regresar = regresar;
        detalleTicketCtrl.editarTicket_action = editarTicket_action;
        detalleTicketCtrl.asignarTicket_action = asignarTicket_action;
        detalleTicketCtrl.bitacoraTicket_action = bitacoraTicket_action;
        detalleTicketCtrl.modificarTicket = modificarTicket;
        detalleTicketCtrl.asignarTicket = asignarTicket;
        detalleTicketCtrl.bitacoraAction = bitacoraAction;
        detalleTicketCtrl.idticketbusqueda = $scope.idticketbusqueda;
        detalleTicketCtrl.bbuscar = $scope.bbuscar;
        detalleTicketCtrl.usuario = $scope.usuario;
        detalleTicketCtrl.perfil = $scope.perfil;
        detalleTicketCtrl.miTicket = {};
        detalleTicketCtrl.fechaEntrega = {};
        detalleTicketCtrl.fechaEntrega.minDate = new Date();
        detalleTicketCtrl.tiempoAtencion = new Date(1900, 1, 1);
        detalleTicketCtrl.beditarticket = true;
        detalleTicketCtrl.basignarticket = true;
        detalleTicketCtrl.bbitacoraticket = true;
        detalleTicketCtrl.basignaUsuario = false;

        buscarTicket();

        function buscarTicket() {

            $log.info("detalleTicket directive");
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


            /*
             * 
             Datos de prueba
             */
//            detalleTicketCtrl.bbusquedacorrecta = true;
            /*
             * 
             */

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

        function close_menu(imenu) {
            switch (imenu) {
                case 0:
                    detalleTicketCtrl.basignarticket = false;
                    detalleTicketCtrl.beditarticket = false;
                    detalleTicketCtrl.bbitacoraticket = false;
                    $timeout(function () {
                        detalleTicketCtrl.basignarticket = true;
                        detalleTicketCtrl.beditarticket = true;
                        detalleTicketCtrl.bbitacoraticket = true;
                    });
                    break;
                case 1:
                    detalleTicketCtrl.basignarticket = false;
                    detalleTicketCtrl.bbitacoraticket = false;
                    break;
                case 2:
                    detalleTicketCtrl.beditarticket = false;
                    detalleTicketCtrl.bbitacoraticket = false;
                    break;
                case 3:
                    detalleTicketCtrl.basignarticket = false;
                    detalleTicketCtrl.beditarticket = false;
                    break;
            }
        }

        function editarTicket_action() {
            $log.info("editarTicket_action---");
            detalleTicketCtrl.beditarticket = !detalleTicketCtrl.beditarticket;
//            close_menu(1);
        }

        function asignarTicket_action() {
            $log.info("asignarTicket_action---");
            detalleTicketCtrl.basignarticket = !detalleTicketCtrl.basignarticket;
//            close_menu(2);
        }

        function bitacoraTicket_action() {
            $log.info("bitacoraTicket_action -- detalleTickets.directive ----");
            detalleTicketCtrl.bbitacoraticket = !detalleTicketCtrl.bbitacoraticket;
//            close_menu(3);
        }

        function modificarTicket() {
            $log.info("modificarTicket -- detalleTickets.directive ----");
            close_menu(0);
            //buscarTicket();
        }

        function asignarTicket() {
            $log.info("asignarTicket -- detalleTickets.directive ----");
            close_menu(0);
            //buscarTicket();
        }

        function bitacoraAction() {
            $log.info("bitacoraTicket -- detalleTickets.directive ----");
            detalleTicketCtrl.basignarticket = false;
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
