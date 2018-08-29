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

        var tickets = $resource(serviceUrl + 'tablero/:servicio', {servicio: '@servicio'}, {
            getTotales: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    usuarioAsignado: '@usuarioAsignado',
                    idArea: '@idArea',
                    idCategoria: '@idCategoria'
                }
            },
            getDetalle: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    usuarioAsignado: '@usuarioAsignado',
                    status: '@status',
                    idArea: '@idArea',
                    idCategoria: '@idCategoria',
                    idTicket: '@idTicket'
                }
            },
            getUser: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            getAreas: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    user: '@user'                   
                }
            },
            getCategorias: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    idArea: '@idArea'
                }
            },
            getTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    idTicket: '@idTicket'
                }
            },
            getComplejidad: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
            getUltimoTicketEntrega: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    user: '@user'  
                }
            },
            updateAsignarTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, 
                params: {
                    ticket: '@ticket'  
                }
            },
            updateEstadoTicket: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, 
                params: {
                    ticket: '@ticket'  
                }
            },
            getUltimasActividades: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                    user: '@user',
                    idTicket: '@idTicket'
            }
            },
            getUltimoSubproyecto: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params: {
                    user: '@user',
                    idTicket: '@idTicket'
                }
            }
        });



        var tableroService = {
            getTotalesTickets: getTotalesTickets,
            getDetalleTickets: getDetalleTickets,
            getUser: getUser,
            getAreasByUser: getAreasByUser,
            getCategoriasByArea: getCategoriasByArea,
            getTicket: getTicket,
            getComplejidad: getComplejidad,
            getUltimoTicketEntrega: getUltimoTicketEntrega,
            updateAsignarTicket: updateAsignarTicket,
            updateEstadoTicket: updateEstadoTicket,
            getUltimasActividades: getUltimasActividades,
            getUltimoSubproyecto: getUltimoSubproyecto
        };

        return tableroService;

        function getTotalesTickets(params) {
            return tickets.getTotales({servicio: 'gettotalestickets.action'}, params);
        }
        
        function getDetalleTickets(params) {
            return tickets.getDetalle({servicio: 'getdetalletickets.action'}, params);
        }
        
        function getUser() {
            return tickets.getUser({servicio: 'getuser.action'});
        }
        
         function getAreasByUser(params) {
            return tickets.getAreas({servicio: 'getareas.action'}, params);
        }
        
         function getCategoriasByArea(params) {
            return tickets.getCategorias({servicio: 'getcategorias.action'}, params);
        }
        
        function getTicket(params) {
            return tickets.getTicket({servicio: 'getticket.action'}, params);
        }
        
        function getComplejidad() {
            return tickets.getComplejidad({servicio: 'getcomplejidad.action'});
        }
        
        function getTicket(params) {
            return tickets.getTicket({servicio: 'getticket.action'}, params);
        }
        
        function getUltimoTicketEntrega(params) {
            return tickets.getUltimoTicketEntrega({servicio: 'getultimoticketentrega.action'}, params);
        }
         
        function updateAsignarTicket(params) {
            return tickets.updateAsignarTicket({servicio: 'updateasignarticket.action'}, params);
        }
        
        function updateEstadoTicket(params) {
            return tickets.updateEstadoTicket({servicio: 'updateestadoticket.action'}, params);
        }
        
        function getUltimasActividades(params) {
            return tickets.getUltimasActividades({servicio: 'getultimasactividades.action'}, params);
        }

        function getUltimoSubproyecto(params) {
            return tickets.getUltimoSubproyecto({servicio: 'getultimosubproyecto.action'}, params);
    }
    }
})();
