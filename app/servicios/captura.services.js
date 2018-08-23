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
        .factory('CapturaServicios', CapturaServicios);

    CapturaServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function CapturaServicios($resource, $window, serviceUrl, toaster) {


        var captura = $resource(serviceUrl + 'captura/:servicio', {servicio: '@servicio'}, {
            validaEtiqueta: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	capturaEtiqueta: '@capturaEtiqueta'
                }
            },
            consultaApp: { 
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
            guardaCaptura: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	datosCaptura: '@datosCaptura'
                }
            },
            validaAuto: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	codigoAutorizacion: '@codigoAutorizacion',
                	tipoAut: '@tipoAut'
                }
            }
        });


        var serviciosCaptura = {
        		validaEtiquetaGral: validaEtiquetaGral,
        		consultaAplicaciones: consultaAplicaciones,
        		guardarCaptura: guardarCaptura,
        		validaAutorizacion: validaAutorizacion


        };

        return serviciosCaptura;


        function validaEtiquetaGral(params) {
            return captura.validaEtiqueta({servicio: 'validaEtiqueta.action'}, params);
        }
        

        function consultaAplicaciones(params) {
            return captura.consultaApp({servicio: 'consultaApp.action'}, params);
        }
        
        function guardarCaptura(params) {
            return captura.guardaCaptura({servicio: 'guardaCaptura.action'}, params);
        }
        
        function validaAutorizacion(params) {
            return captura.validaAuto({servicio: 'validaAutorizacion.action'}, params);
        }
        

    }
})();
