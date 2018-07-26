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
        .factory('reporteService', reporteService);

    reporteService.$inject = ['$resource', '$window', 'serviceUrl', 'toaster'];

    function reporteService($resource, $window, serviceUrl, toaster) {


        var consulta = $resource(serviceUrl + 'reportes/:servicio', {servicio: '@servicio'}, {
            consultaProyeCliente: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params:{
                    pIdCliente: '@pIdCliente'
                }
            },
            consultaActRec: {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                params:{
                	pIdPlantilla: '@pIdPlantilla',
                	idArea: '@idArea',
                	fecIni: '@fecIni',
                	fecFin: '@fecFin'
                }
            },
            consultaActRecList: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params:{
                	pIdPlantilla: '@pIdPlantilla',
                	idArea: '@idArea',
                	fecIni: '@fecIni',
                	fecFin: '@fecFin'
                }
            },
            consultaCProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
            consultaSProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true
            },
            consultaDocProy: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params:{
                	pIdCliente: '@pIdCliente'
                }
            },
            consultaContratosVigCli: {
                method: 'POST', headers: {'Content-Type': 'application/json'}, isArray: true,
                params:{
                	pSigno: '@pSigno'
                }
            }
        });
        


        var serviciosReportes = {
            consultaProyectoClienteMonto: consultaProyectoClienteMonto,
            consultaActividadesRecurso: consultaActividadesRecurso,
            consultaActRecList: consultaActRecList,
            consultaCProyecto: consultaCProyecto,
            consultaSProyecto: consultaSProyecto,
            consultaDocProyecto: consultaDocProyecto,
            contratosVigentesCliente: contratosVigentesCliente
        };

        return serviciosReportes;


        function consultaProyectoClienteMonto(params) {
            return consulta.consultaProyeCliente({servicio: 'getProyectosClienteMonto.action'}, params);
        }
        
        function consultaActividadesRecurso(params) {
            return consulta.consultaActRec({servicio: 'getActividadesRecursos.action'}, params);
        }
        
        function consultaActRecList(params) {
            return consulta.consultaActRecList({servicio: 'getActRec.action'}, params);
        }
        
        function consultaCProyecto(){
            return consulta.consultaCProy({servicio: 'getClientesCProyecto.action'});
        }
        
        function consultaSProyecto(){
            return consulta.consultaSProy({servicio: 'getClientesSProyecto.action'});
        }
        
        function consultaDocProyecto(params){
            return consulta.consultaDocProy({servicio: 'getDocProyecto.action'}, params);
        }
        
        function contratosVigentesCliente(params){
            return consulta.consultaContratosVigCli({servicio: 'getContratosVigentesCliente.action'}, params);
        }

    }
})();
