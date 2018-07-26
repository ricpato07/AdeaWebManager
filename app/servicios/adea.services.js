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
        .factory('AdeaServicios', AdeaServicios);

    AdeaServicios.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function AdeaServicios($resource, $window, serviceUrl, toaster) {


        var catalogos = $resource(serviceUrl + 'catalogos/:servicio', {servicio: '@servicio'}, {
            consulta: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params:{
                    keyCatalogo: '@keyCatalogo',
                    scltcod: '@scltcod',
                    claveCat: '@claveCat'
                }
            },
            consultaDiasFest: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
            consultaCatGral: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params: {
                	keyCatalogo: '@keyCatalogo',
                	grpCat: '@grpCat'
                }
            }
        });
        
        var usuario = $resource(serviceUrl + 'catalogos/:servicio', {servicio: '@servicio'}, {
        	consultaUser: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            consultaUserMx: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            }
        });


        var serviciosAdea = {
            alerta: alerta,
            validarDato: validarDato,
            consultaCatalogo: consultaCatalogo,
            compareDate: compareDate,
            consultaUsuario: consultaUsuario,
            consultaUsuarioMx: consultaUsuarioMx,
            consultaDiasFestivos: consultaDiasFestivos,
            consultaCatalogoGral: consultaCatalogoGral
        };

        return serviciosAdea;

        function alerta(tipo, cuerpo) {
            toaster.pop({
                type: tipo,
                title: "",
                body: cuerpo,
                timeout: 3000,
                showCloseButton: true
            });
        }

        function validarDato(valor) {
            var bandera = false;
            if (valor != undefined && valor != null && valor != '') {
                bandera = true;
            }
            return bandera;

        };

        function consultaCatalogo(params) {
            return catalogos.consulta({servicio: 'consultaCatalogo.action'}, params);
        }

        function compareDate(dateTimeA, dateTimeB) {
            var momentA = moment(dateTimeA,"DD/MM/YYYY");
            var momentB = moment(dateTimeB,"DD/MM/YYYY");
            if (momentA > momentB) return 1;
            else if (momentA < momentB) return -1;
            else return 0;
        }
        

        function consultaUsuario() {
            return usuario.consultaUser({servicio: 'consultaUsuario.action'});
        }
        
        function consultaUsuarioMx(params) {
            return usuario.consultaUserMx({servicio: 'consultaUsuarioMx.action'}, params);
        }
        
        function consultaDiasFestivos(params) {
            return catalogos.consultaDiasFest({servicio: 'consultaDiasfestivos.action'}, params);
        }
        
        function consultaCatalogoGral(params) {
            return catalogos.consultaCatGral({servicio: 'consultaCatalogoGral.action'}, params);
        }

    }
})();
