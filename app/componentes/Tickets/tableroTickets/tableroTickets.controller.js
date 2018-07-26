(function () {
    'use strict';

    angular.module('adeaModule').controller('TableroTicketsController', TableroTicketsController);

    TableroTicketsController.$inject = ['$log', '$timeout', 'AdeaServicios','tableroServicios', '$window'];

    function TableroTicketsController($log, $timeout, AdeaServicios, tableroServicios, $window) {

        var tableroTicketsCtrl = this;
        tableroTicketsCtrl.consultaTotales = consultaTotales;
        tableroTicketsCtrl.user = {usuarioAsignado:"ilopezz", idArea:null}

        function consultaTotales() {
            $log.info('---consultaTotales---');
            var params = {
                usuarioAsignado: tableroTicketsCtrl.user.usuarioAsignado,
                idArea: tableroTicketsCtrl.user.idArea
            };
            var promesa = tableroServicios.getTotalesTickets(params).$promise;

            promesa.then(function (respuesta) {
                tableroTicketsCtrl.lista = respuesta;
                $log.info(respuesta);
    
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar el tablero");
            });
        }
        consultaTotales();
    }
})();