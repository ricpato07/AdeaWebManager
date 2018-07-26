/**
 * Created by ilopezz
 */
(function () {
    angular
        .module('adeaModule')
        .controller('adeaControlador', AdeaControlador);

    AdeaControlador.$inject = ['$rootScope', '$scope', '$log'];

    /* @ngInject */
    function AdeaControlador($rootScope, $scope, $log) {
        /* jshint validthis: true */
        var adeaCtrl = this;
        activar();

        function activar(){
            $log.info("Activar adeaControlador");
        }

    }
})();
