(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:asignarTickets
     * @scope
     * @restrict E
     * @description Directiva que se encarga de la búsqueda del ticket
     */
    angular
            .module('adeaDirectivas')
            .controller('modalController', modalController)
            .directive('modal', modal);
    modal.$inject = ['$log'];
    modalController.$inject = ['$log', '$scope'];
    function modalController($log, $scope) {
        var modalCtrl = this;
        modalCtrl.aceptarModal = aceptarModal;
        modalCtrl.cancelarModal = cancelarModal;
        modalCtrl.titulo = $scope.titulo;
        modalCtrl.mensaje = $scope.mensaje;
        
        showModal();
        
        function showModal(){
            angular.element('#modalConfirm').modal('show');
        }
        
        function aceptarModal(){
            $log.info("aceptarModal");
            angular.element('#modalConfirm').modal('hide');
            $scope.aceptarModal();
        }
        
        function cancelarModal(){
            $log.info("cancelarModal");
            angular.element('#modalConfirm').modal('hide');
            $scope.cancelarModal();
        }

    }

    function modal() {
        var directiva = {
            controller: modalController,
            restrict: 'E',
            controllerAs: 'modalCtrl',
            transclude: false,
            scope: {
                titulo: '=?',
                mensaje: '=',
                aceptarModal: '&?',
                cancelarModal: '&?'
            },
            templateUrl: 'app/directivas/modalMessage/modal.html'
        };
        return directiva;
    }

})();
