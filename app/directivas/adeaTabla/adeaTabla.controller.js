(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:Tabla
     * @scope
     * @restrict E
     * @description Directiva que se encarga del la tabla de registros dentro de los mantenimientos,
     * y otors lugares dentor de sistema.
     */
    angular
        .module('adeaDirectivas')
        .controller('Tabla', Tabla)
        .directive('adeaTabla', adeaTabla);

    adeaTabla.$inject = ['$log'];
    Tabla.$inject = ['$log', '$scope', 'AdeaServicios', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$filter', '$compile'];

    function Tabla($log, $scope, AdeaServicios, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $filter, $compile) {

        var tablaCtrl = this;


        tablaCtrl.numRegPag = 10;
        tablaCtrl.paginacion = [5, 10, 25, 50, 100];
        tablaCtrl.paginar = true;
        tablaCtrl.buscar = true;

        tablaCtrl.valorSele = false;

        $scope.muestraDetalle = mostrarDetalle;
        tablaCtrl.ocultarDetalle = ocultarDetalle;
        tablaCtrl.seleccionarTodo = seleccionarTodo;
        tablaCtrl.clickear = clickear;
        tablaCtrl.seleccionar = seleccionar;
        tablaCtrl.seleccionarPropiedadDeObjeto = seleccionarPropiedadDeObjeto;

        $scope.seleccionados = [];
        $scope.muestraDetalles = true;

        tablaCtrl.mensaje = 'NOHAYREGISTROS';
        activar();

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#activar
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua a activar la directiva para saber la configuraciones de la tabla
         * que tendra por defecto
         */
        function activar() {
            $log.info("Entra al metodo activar() de la directiva xsadminTabla");

            if (AdeaServicios.validarDato($scope.dtDataSource)) {
                $scope.seleccionados = [];

                angular.forEach($scope.dtDataSource, function (empleado) {
                    if (empleado.seleccionado) {
                        seleccionarPropiedadDeObjeto(empleado);
                    }
                });

            }

            if ($scope.numreg != undefined && $scope.numreg != '') {
                tablaCtrl.numRegPag = $scope.numreg;
            }

            if ($scope.paginacion != undefined && $scope.paginacion != '') {
                tablaCtrl.paginacion = $scope.paginacion;
            } else {

            }

            if ($scope.paginar != undefined && $scope != '') {
                tablaCtrl.paginar = $scope.paginar;
            }

            if ($scope.buscar != undefined && $scope != '') {
                tablaCtrl.buscar = $scope.buscar;
            }

            if ($scope.mensaje != undefined && $scope != '') {
                tablaCtrl.mensaje = $scope.mensaje;
            }
            

            tablaCtrl.dtOptions = DTOptionsBuilder.newOptions().withOption("bPaginate", tablaCtrl.paginar)
                .withOption("bFilter", tablaCtrl.buscar)
                .withPaginationType('full_numbers').withDisplayLength(tablaCtrl.numRegPag)
                .withOption('responsive', true)
                .withOption('order', validaOrder())
                .withOption("aLengthMenu", [[5, 10, 25, 50, -1], tablaCtrl.paginacion]);
            //.withLanguage("sEmptyTable", $filter('translate')(tablaCtrl.mensaje))
            tablaCtrl.dtColumnOptions = $scope.options;
        }

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#ocultarDetalle
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua al momento querer ocultar el detalle de la tabla
         * solo asigan una varible
         *
         */
        function ocultarDetalle() {
            $log.info("Entra al metodo ocultarDetalle() de la directiva xsadminTabla");
            $scope.muestraDetalles = true;
            
            $log.info($scope.ejecutaRegresar);
            
            if($scope.ejecutaRegresar != null && $scope.ejecutaRegresar != undefined && $scope.ejecutaRegresar != ''){
            	$log.info('entra al if');
            	$scope.ejecutaRegresar();
            }
        }

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#mostrarDetalle
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua al querer mostar el detalle de regsitro que se esta seleccioado
         *
         * @param {Boolean} boolean = valor en true o false
         */

        function mostrarDetalle(boolean) {
            $log.info("Entra al metodo mostrarDetalle() de la directiva xsadminTabla");

            $scope.muestraDetalles = boolean;
        }

        function validaOrder(){
            if($scope.columFilter == null || $scope.columFilter == undefined || $scope.columFilter == ''){
                return [];
            }else{
                return [$scope.columFilter];
            }
        }

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#ocultarDetalleInternos
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua al momento querer ocultar el detalle de la tabla
         * solo asigan una varible
         *
         */
        function ocultarDetalleInternos() {
            $log.info("Entra al metodo ocultarDetalle() de la directiva xsadminTabla");
            $scope.detalleInterno = true;
        }

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#mostrarDetalle
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua al querer mostar el detalle de regsitro que se esta seleccioado
         *
         * @param {Boolean} boolean = valor en true o false


         function detalleInterno(boolean) {
            $log.info("Entra al metodo detalleInterno() de la directiva xsadminTabla");
            $scope.detalleInterno = boolean;
        }*/

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#seleccionarPropiedadDeObjeto
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua al seleccioanar un registro con la configuracion
         * de que se pueda elegir varios con un chekbox
         *
         * @param {Object} reg : valor del registro seleccionado
         */
        function seleccionarPropiedadDeObjeto(reg) {
            $log.info("Entra al metodo seleccionarPropiedadDeObjeto() de la directiva xsadminTabla");

            var valor = angular.copy(reg);

            if (reg.seleccionado) {
                delete valor.seleccionado;
                $scope.seleccionados.push(valor);

            }
            else {
                delete valor.seleccionado;

                var indexIf = _.findIndex($scope.seleccionados, function (val) {
                    return val[$scope.propiedad] == valor[$scope.propiedad];
                });

                $scope.seleccionados.splice(indexIf, 1);

            }

            tablaCtrl.seSelecciono = true;
        }

        /**
         * @ngdoc method
         * @name xsAdmin.Tabla#seleccionarTodo
         * @methodOf xsAdmin.directive:Tabla
         * @description
         * Funcion que se ejectua cuanod seleccioanda todos los registros de la tabla
         * con la configuracion de loc checkbox
         *
         * @param {Object} todo : todos los resgitros seleccioandos con el checkbox
         */
        function seleccionarTodo(todo) {
            $log.info("Entra al metodo seleccionarTodo() de la directiva xsadminTabla");

            angular.forEach($scope.dtDataSource, function (val) {
                var valor = angular.copy(val);
                if (todo) {
                    if (!val.seleccionado) {
                        val.seleccionado = true;
                        delete  valor.seleccionado;
                        $scope.seleccionados.push(valor);
                    }
                }
                else {
                    if (val.seleccionado) {
                        val.seleccionado = false;
                        delete  valor.seleccionado;
                        var index = $scope.seleccionados.indexOf(valor);
                        $scope.seleccionados.splice(index, 1);
                    }
                }
            });
        }

        /**
         * @ngdoc method
         * @name xpertysModulo.xsTabla#clcikear
         * @methodOf xpertysModulo.directive:xsTabla
         * @description Funcion que se ejecuta al dar clic a un registro de la tabla.
         * Y se valida que tenga la propiedad de detalleInterno para as� mostrar el detalle
         * en la tabla o no.
         */
        function clickear(registro) {

            if ($scope.detalleInterno != undefined) {
                if ($scope.registroSeleccionado != registro && $scope.detalleInterno) {
                    $scope.detalleInterno = $scope.detalleInterno;
                } else {
                    $scope.detalleInterno = !$scope.detalleInterno;
                }
            }
        }


        function seleccionar(registro) {

            if($scope.detalleInterno){
                if(!tablaCtrl.seSelecciono){
                    $scope.seleccionarRegistro({reg: registro});
                }
            }else{
                $scope.seleccionarRegistro({reg: registro});
            }

            tablaCtrl.seSelecciono = false;
        }
        
    }


    adeaTabla.$inject = ['$log'];
    function adeaTabla() {
        var directiva = {
            controller: Tabla,
            restrict: 'E',
            controllerAs: 'tablaCtrl',
            transclude: true,
            scope: {
                dtDataSource: '=',
                numreg: '=?',
                config: '=',
                tituloDetalle: '=?',
                seleccionarRegistro: '&',
                registroSeleccionado: '=',
                muestraDetalle: '=?',
                options: '=?',
                mensaje: '=?',
                paginacion: '=?',
                paginar: '=?',
                buscar: '=?',
                propiedad: '=?',
                seleccionados: '=?',
                objetosSeleccionados: '=',
                muestraDetalles: '=?',
                detalleInterno: '=?',
                lugar: '=?',
                columFilter: '=?',
                ejecutaRegresar: '&'
                
            },
            templateUrl: 'app/directivas/adeaTabla/adeaTabla.html'
        };

        return directiva;
    }
})();
