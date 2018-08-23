(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas')
			.controller('dobleCapturaMinusculasController', dobleCapturaMinusculasController)
			.directive('dobleCapturaMinusculas', dobleCapturaMinusculas)
			.controller('modalDobleCapturaMinusculasController', modalDobleCapturaMinusculasController);

	dobleCapturaMinusculasController.$inject = [ '$log', '$scope', 'AdeaServicios',
			'$filter', '$compile', 'ProformaServicios', 'FacturacionServicios',
			'$window', 'MantenimientoFacServicios', '$uibModal', '$timeout' ];

	function dobleCapturaMinusculasController($log, $scope, AdeaServicios, $filter,
			$compile, ProformaServicios, FacturacionServicios, $window,
			MantenimientoFacServicios, $uibModal, $timeout) {

		var dobleCapturaMinusculasCtrl = this;

		dobleCapturaMinusculasCtrl.dobleCapturaEnter = dobleCapturaEnter;

		dobleCapturaMinusculasCtrl.patron = $scope.patron;
		dobleCapturaMinusculasCtrl.disabled = $scope.disabled;
		dobleCapturaMinusculasCtrl.placeholder = $scope.placeholder;
		dobleCapturaMinusculasCtrl.identificador = $scope.identificador;
		dobleCapturaMinusculasCtrl.maxlength = $scope.maxlength;
		dobleCapturaMinusculasCtrl.tipo = $scope.tipo;
		dobleCapturaMinusculasCtrl.tabindex = $scope.index;
		dobleCapturaMinusculasCtrl.required = $scope.required;
		dobleCapturaMinusculasCtrl.visible = true;
		dobleCapturaMinusculasCtrl.expresion = '';
		dobleCapturaMinusculasCtrl.valor = $scope.valor;

		activar()

		function activar() {
			$log.info('activaDirectivaDobleCaptura');
			$log.info(dobleCapturaMinusculasCtrl.valor);

			if (dobleCapturaMinusculasCtrl.patron == null
					|| dobleCapturaMinusculasCtrl.patron == undefined
					|| dobleCapturaMinusculasCtrl.patron == '') {
				dobleCapturaMinusculasCtrl.expresion = '';
			}

			if (dobleCapturaMinusculasCtrl.disabled == null
					|| dobleCapturaMinusculasCtrl.disabled == undefined
					|| dobleCapturaMinusculasCtrl.disabled == '') {
				dobleCapturaMinusculasCtrl.disabled = false;
			}
			if (dobleCapturaMinusculasCtrl.placeholder == null
					|| dobleCapturaMinusculasCtrl.placeholder == undefined
					|| dobleCapturaMinusculasCtrl.placeholder == '') {
				dobleCapturaMinusculasCtrl.placeholder = '';
			}

			if (dobleCapturaMinusculasCtrl.maxlength == null
					|| dobleCapturaMinusculasCtrl.maxlength == undefined
					|| dobleCapturaMinusculasCtrl.maxlength == '') {
				dobleCapturaMinusculasCtrl.maxlength = '';
			}
			if (dobleCapturaMinusculasCtrl.tabindex == null
					|| dobleCapturaMinusculasCtrl.tabindex == undefined
					|| dobleCapturaMinusculasCtrl.tabindex == '') {
				dobleCapturaMinusculasCtrl.tabindex = '';
			}
			if (dobleCapturaMinusculasCtrl.required == null
					|| dobleCapturaMinusculasCtrl.required == undefined
					|| dobleCapturaMinusculasCtrl.required == '') {
				dobleCapturaMinusculasCtrl.required = false;
			}

			if (dobleCapturaMinusculasCtrl.valor != undefined
					&& dobleCapturaMinusculasCtrl.valor != ''
					&& dobleCapturaMinusculasCtrl.valor != null) {
				$scope.recaptura = dobleCapturaMinusculasCtrl.valor;
			}

			validaPatron();

		}

		function validaPatron() {

			if (dobleCapturaMinusculasCtrl.patron == 'fecha') {
				dobleCapturaMinusculasCtrl.expresion = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
			} else if (dobleCapturaMinusculasCtrl.patron == 'texto') {
				dobleCapturaMinusculasCtrl.expresion = /^[a-z\saéíóúü.]*$/;
			} else if (dobleCapturaMinusculasCtrl.patron == 'numerico') {
				dobleCapturaMinusculasCtrl.expresion = /^[0-9]*$/;
			} else if (dobleCapturaMinusculasCtrl.patron == 'correo') {
				dobleCapturaMinusculasCtrl.expresion = /^[a-zA-Z0-9!#$%''\*\+-/=\?^_`\{|\}~]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]{2,4}$/;
			}
		}

		function dobleCapturaEnter() {
			$log.info('dobleCaptura');

			if ($scope.valor != null && $scope.valor != ''
					&& $scope.valor != undefined
					&& dobleCapturaMinusculasCtrl.valor != $scope.valor) {

				if (dobleCapturaMinusculasCtrl.patron != null
						&& dobleCapturaMinusculasCtrl.patron != ''
						&& dobleCapturaMinusculasCtrl.patron != undefined) {

					$log.info(dobleCapturaMinusculasCtrl.expresion);

					if (dobleCapturaMinusculasCtrl.expresion.test($scope.valor)) {
						dobleCapturaMinusculasCtrl.valor = $scope.valor;
						dobleCapturaMinusculasCtrl.visible = false;
						open();
						$timeout(function() {
							var nextTabIndex = parseInt($scope.index + 1);
							$("[tabindex=" + nextTabIndex + "]").focus();
						}, 500);
					} else {
						$scope.valor = null;
						AdeaServicios
								.alerta("error",
										'Formato de la cadena invalido, capture con formato: '
												+ dobleCapturaMinusculasCtrl.patron
														.toUpperCase());
					}
				} else {
					dobleCapturaMinusculasCtrl.valor = $scope.valor;
					dobleCapturaMinusculasCtrl.visible = false;
					open();
					$timeout(function() {
						var nextTabIndex = parseInt($scope.index + 1);
						$("[tabindex=" + nextTabIndex + "]").focus();
					}, 500);
				}
			}
		}

		function open() {
			var modalinstance = $uibModal.open({
				scope : $scope,
				templateUrl : 'modalMinus.html',
				controller : 'modalDobleCapturaMinusculasController',
				controllerAs : 'modalCtrl',
				resolve : {
					valor : function() {
						return $scope.valor;
					}
				},
				backdrop : 'static'
			});

			modalinstance.result.then(function() {
				$log.info('Modal : ' + new Date());
				dobleCapturaMinusculasCtrl.visible = true;
				var nextTabIndex = parseInt($scope.index) + 2;
				$("[tabindex=" + nextTabIndex + "]").focus();
			}, function() {
				dobleCapturaMinusculasCtrl.visible = true;
				$scope.valor = '';

				$timeout(function() {
					var nextTabIndex = parseInt($scope.index);
					$("[tabindex=" + nextTabIndex + "]").focus();
				}, 500);
				dobleCapturaMinusculasCtrl.valor = null;
			});

		}

	}

	modalDobleCapturaMinusculasController.$inject = [ '$log', '$scope', 'AdeaServicios',
			'$filter', '$compile', 'ProformaServicios', 'FacturacionServicios',
			'$window', 'MantenimientoFacServicios', '$uibModalInstance' ];

	function modalDobleCapturaMinusculasController($log, $scope, AdeaServicios, $filter,
			$compile, ProformaServicios, FacturacionServicios, $window,
			MantenimientoFacServicios, $uibModalInstance) {

		var modalMinusculasCtrl = this;

		modalMinusculasCtrl.validaDobleCaptura = validaDobleCaptura;

		function validaDobleCaptura() {
			if ($scope.recaptura == $scope.valor) {
				$uibModalInstance.close($scope.recaptura);
			} else {
				$window.document.getElementById($scope.identificador + 'DC')
						.focus();
			}

		}
	}

	dobleCapturaMinusculas.$inject = [ '$log' ];
	function dobleCapturaMinusculas($log) {
		var directiva = {
			controller : dobleCapturaMinusculasController,
			restrict : 'E',
			controllerAs : 'dobleCapturaMinusculasCtrl',
			transclude : false,
			scope : {
				patron : '=?',
				disabled : '=?',
				placeholder : '=?',
				valor : '=',
				identificador : '=',
				maxlength : '=?',
				tipo : '=',
				index : '=?',
				required : '=?',
				titulo : '='
			},
			templateUrl : 'app/directivas/adeaDobleCapturaMinusculas/adeaDobleCapturaMinusculas.html'

		};

		return directiva;
	}
	
})();
