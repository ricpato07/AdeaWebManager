/**
 * Created by ilopezz
 */
(function () {
    'use strict';

    angular
        .module('adeaModule')
        .config(configuracion)
        .config(function(blockUIConfig){
        	blockUIConfig.templateUrl='app/componentes/blockUI/blockUI.html'
        });

    configuracion.$inject = ['$routeProvider', '$httpProvider', '$logProvider', '$provide', '$windowProvider'];

    /* @ngInject */
    function configuracion($routeProvider, $httpProvider, $logProvider, $provide, $windowProvider) {
    	
    	
    	var $window = $windowProvider.$get();
    	var url = $window.location.origin;
    	var awmDesarrollo = false;
    	
    	$provide.value('serviceUrl', url + '/adeaweb-manager/');
    	
    	var regex = /(\d+)/g;
    	
    	
    	if(url.match(regex) != null || url.search("dev") > 0 || url.search("localhost")>0){
    		console.log('----------------Log');
    		awmDesarrollo = true;
    	}
    	
    	
    	if (!awmDesarrollo) {
            $logProvider.debugEnabled(true);
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                $delegate.table = angular.noop;
                return $delegate;
            }]);
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                $delegate.info = angular.noop;
                return $delegate;
            }]);
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                $delegate.warn = angular.noop;
                return $delegate;
            }]);
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                $delegate.error = angular.noop;
                return $delegate;
            }]);
        }

        //Portal
        $routeProvider.when('/planeacionProyecto', {
            templateUrl: 'app/componentes/proyectos/planeacionProyecto.html',
            controller: 'PlaneacionProyectoController',
            controllerAs: 'planeacionProyectoCtrl'
        });


        $routeProvider.when('/plantillaProyecto', {
            templateUrl: 'app/componentes/plantilla/plantillaProyecto.html',
            controller: 'PlantillaProyectoController',
            controllerAs: 'plantillaProyectoCtrl'
        });

        $routeProvider.when('/ticket', {
            templateUrl: 'app/componentes/Tickets/tickets/ticket.html',
            controller: 'TicketController',
            controllerAs: 'ticketCtrl'
        });
        
        $routeProvider.when('/registroTicket', {
            templateUrl: 'app/componentes/Tickets/registroTickets/reportarTicket.html',
            controller: 'ReportarTicketController',
            controllerAs: 'reportarTicketCtrl'
        });

        $routeProvider.when('/reporteContratos', {
            templateUrl: 'app/componentes/reporteContratos/reporteContratos.html',
            controller: 'ReporteContratosController',
            controllerAs: 'reporteContratosCtrl'
        });
    
    
	    $routeProvider.when('/facturacion', {
	        templateUrl: 'app/componentes/facturacion/facturacion/facturacionGral.html',
	        controller: 'FacturacionController',
	        controllerAs: 'facturacionCtrl'
	    });
	    
	    $routeProvider.when('/carteraClienteFac', {
	        templateUrl: 'app/componentes/facturacion/mntCarteraCliente/mntCarteraCliente.html',
	        controller: 'MntCarteraClienteFacController',
	        controllerAs: 'mntCarteraClienteFacCtrl'
	    });

	    
	    $routeProvider.when('/resumenProyectos', {
	        templateUrl: 'app/componentes/resumenProyectos/resumenProyectos.html',
	        controller: 'ResumenProyectosController',
	        controllerAs: 'resumenProyectosCtrl'
	    });
	    
	    $routeProvider.when('/visor', {
	        templateUrl: 'app/componentes/Visor/visor.html',
	        controller: 'VisorController',
	        controllerAs: 'visorCtrl'
	    });
	    
	    $routeProvider.when('/tableroRecursos', {
	        templateUrl: 'app/componentes/seguimiento/tableroRecursos.html',
	        controller: 'TableroRecurosController',
	        controllerAs: 'tableroRecursosCtrl'
	    });
	    
	    $routeProvider.when('/incidenciasFacturacion', {
	        templateUrl: 'app/componentes/facturacion/incidencias/incidencias.html',
	        controller: 'IncidenciasController',
	        controllerAs: 'incidenciasCtrl'
	    });
	    
	    $routeProvider.when('/tableroTickets', {
	        templateUrl: 'app/componentes/Tickets/tableroTickets/tableroTickets.html',
	        controller: 'TableroTicketsController',
	        controllerAs: 'tableroTicketsCtrl'
	    });
	    
	    $routeProvider.when('/mntItemsFac', {
	        templateUrl: 'app/componentes/facturacion/mntItemsFac/mntItemsFac.html',
	        controller: 'MntItemsFacController',
	        controllerAs: 'mntItemsFacCtrl'
	    });
	    
	    $routeProvider.when('/conceptosFacturacion', {
	        templateUrl: 'app/componentes/facturacion/mntConceptosFact/mntConceptoFact.html',
	        controller: 'MntConceptoFactController',
	        controllerAs: 'mntConceptoFacCtrl'
	    });
	    
	    $routeProvider.when('/consultaFacturacion', {
	        templateUrl: 'app/componentes/facturacion/consultaFacturacion/consultaFacturacion.html',
	        controller: 'ConsultaFacturacionController',
	        controllerAs: 'consultaFacturacionCtrl'
	    });
	    
	    $routeProvider.when('/confProformaFacturacion', {
	        templateUrl: 'app/componentes/facturacion/configuracionProforma/configuracionProforma.html',
	        controller: 'ConfiguracionProformaController',
	        controllerAs: 'configuracionProformaCtrl'
	    });
	    
	    $routeProvider.when('/capturaUsuariosAdea', {
	        templateUrl: 'app/componentes/capturaUsuarios/capturaUsuariosAdea.html',
	        controller: 'CapturaUsuariosController',
	        controllerAs: 'capturaUsuariosCtrl'
	    });

	    
        $routeProvider.otherwise({redirectTo: '/inicio'});

        // Interceptor para Token de sesion
        //$compileProvider.debugInfoEnabled(false);
    };
})();
