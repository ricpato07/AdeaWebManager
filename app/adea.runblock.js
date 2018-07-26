/**
 * Created by ilopezz
 */
(function () {
    'use strict';

    angular
        .module('adeaModule')
        .run(configuracionInicialTabla)
        .run(runBlock);

    runBlock.$inject = ['$log', '$templateCache', '$rootScope', '$location'];

    /* @ngInject */
    function runBlock($log, $templateCache, $rootScope, $location ) {

        $rootScope.$on('$routeChangeSuccess', function (event, next, previous) {
            $log.info('---------------------------------------');
            $rootScope.previousUrl = previous;

            if (next.loadedTemplateUrl == 'componentes/Acceso/inicio/inicio.html') {
                $log.info("$routeChangeSuccess");
            }

        });

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            $log.info('Cambio de url');
            $log.info(next.templateUrl);
        });
        
        
        
    }


    configuracionInicialTabla.$inject=['DTDefaultOptions'];
    function configuracionInicialTabla(DTDefaultOptions) {
        DTDefaultOptions.setLanguageSource('app/i18n/dataTable/Spanish.json');
        DTDefaultOptions.setDisplayLength(25);
        DTDefaultOptions.setLoadingTemplate('<span style="font-size: 20px; font-weight: bold">Cargando...</span>');

    }
})();
