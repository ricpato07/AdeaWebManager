(function () {
    "use strict";

    /**
	 * @ngdoc service
	 * @name mantenimientos.service:tableroServicios
	 * @descripcion Definicion de los servicios de los mantenimientos dentro del
	 *              sistema
	 */
    angular
        .module('serviciosModulo')
        .factory('tableroServicios', tableroServicios);

    tableroServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function tableroServicios($resource, $window, serviceUrl, toaster) {

        var totales = $resource(serviceUrl + 'tablero/:servicio', {servicio: '@servicio'}, {
            getTickets: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	usuarioAsignado: '@usuarioAsignado',
                	idArea: '@idArea'
                }
            }
        });
        
                

        var tableroService = {
            getTotalesTickets: getTotalesTickets
        };

        return tableroService;

       
        function getTotalesTickets(params) {
           return totales.getTickets({servicio: 'gettotalestickets.action'}, params);
        }
                            
    }
})();
