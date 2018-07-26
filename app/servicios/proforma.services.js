(function () {
    "use strict";

    /**
     * @ngdoc service
     * @name mantenimientos.service:mantenimientosServicios
     * @descripcion
     * Definicion de los servicios de los mantenimientos dentro del sistema
     */
    angular
        .module('serviciosModulo')
        .factory('ProformaServicios', ProformaServicios);

    ProformaServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function ProformaServicios($resource, $window, serviceUrl, toaster) {


        var proforma = $resource(serviceUrl + 'proforma/:servicio', {servicio: '@servicio'}, {
            generaProforma: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                    idCartera: '@idCartera',
                    idPeriodo: '@idPeriodo'
                }
            },
            consProforma: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	idCartera: '@idCartera',
                	pIdPeriodo: '@pIdPeriodo'
                    
                }
            },
            altaProforma: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	detalle: '@detalle'
                    
                }
            },
            borraProforma:{
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	detalle: '@detalle'
                    
                }
            }
        });


        var serviciosProforma = {
            generaProforma: generaProforma,
            consultaProforma: consultaProforma,
            addProforma: addProforma,
            delProforma: delProforma

        };

        return serviciosProforma;


        function generaProforma(params) {
            return proforma.generaProforma({servicio: 'generaProforma.action'}, params);
        }
        
        function consultaProforma(params) {
            return proforma.consProforma({servicio: 'consultaProforma.action'}, params);
        }
        
        function addProforma(params) {
            return proforma.altaProforma({servicio: 'addProforma.action'}, params);
        }
        
        function delProforma(params) {
            return proforma.borraProforma({servicio: 'delProforma.action'}, params);
        }
    }
})();
