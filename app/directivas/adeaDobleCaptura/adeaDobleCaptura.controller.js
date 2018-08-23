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
			.controller('dobleCapturaController', dobleCapturaController)
			.directive('dobleCaptura', dobleCaptura)
			.controller('modalDobleCapturaController', modalDobleCapturaController);

	dobleCapturaController.$inject = [ '$log', '$scope', 'AdeaServicios',
			'$filter', '$compile', 'ProformaServicios', 'FacturacionServicios',
			'$window', 'MantenimientoFacServicios', '$uibModal', '$timeout' ];

	function dobleCapturaController($log, $scope, AdeaServicios, $filter,
			$compile, ProformaServicios, FacturacionServicios, $window,
			MantenimientoFacServicios, $uibModal, $timeout) {

		var dobleCapturaCtrl = this;

		dobleCapturaCtrl.dobleCapturaEnter = dobleCapturaEnter;

		dobleCapturaCtrl.patron = $scope.patron;
		dobleCapturaCtrl.disabled = $scope.disabled;
		dobleCapturaCtrl.placeholder = $scope.placeholder;
		dobleCapturaCtrl.identificador = $scope.identificador;
		dobleCapturaCtrl.maxlength = $scope.maxlength;
		dobleCapturaCtrl.tipo = $scope.tipo;
		dobleCapturaCtrl.tabindex = $scope.index;
		dobleCapturaCtrl.required = $scope.required;
		dobleCapturaCtrl.visible = true;
		dobleCapturaCtrl.expresion = '';
		dobleCapturaCtrl.valor = $scope.valor;

		activar()

		function activar() {
			$log.info('activaDirectivaDobleCaptura');
			$log.info(dobleCapturaCtrl.valor);

			if (dobleCapturaCtrl.patron == null
					|| dobleCapturaCtrl.patron == undefined
					|| dobleCapturaCtrl.patron == '') {
				dobleCapturaCtrl.expresion = '';
			}

			if (dobleCapturaCtrl.disabled == null
					|| dobleCapturaCtrl.disabled == undefined
					|| dobleCapturaCtrl.disabled == '') {
				dobleCapturaCtrl.disabled = false;
			}
			if (dobleCapturaCtrl.placeholder == null
					|| dobleCapturaCtrl.placeholder == undefined
					|| dobleCapturaCtrl.placeholder == '') {
				dobleCapturaCtrl.placeholder = '';
			}

			if (dobleCapturaCtrl.maxlength == null
					|| dobleCapturaCtrl.maxlength == undefined
					|| dobleCapturaCtrl.maxlength == '') {
				dobleCapturaCtrl.maxlength = '';
			}
			if (dobleCapturaCtrl.tabindex == null
					|| dobleCapturaCtrl.tabindex == undefined
					|| dobleCapturaCtrl.tabindex == '') {
				dobleCapturaCtrl.tabindex = '';
			}
			if (dobleCapturaCtrl.required == null
					|| dobleCapturaCtrl.required == undefined
					|| dobleCapturaCtrl.required == '') {
				dobleCapturaCtrl.required = false;
			}

			if (dobleCapturaCtrl.valor != undefined
					&& dobleCapturaCtrl.valor != ''
					&& dobleCapturaCtrl.valor != null) {
				$scope.recaptura = dobleCapturaCtrl.valor;
			}

			validaPatron();

		}

		function validaPatron() {

			if (dobleCapturaCtrl.patron == 'fecha') {
				dobleCapturaCtrl.expresion = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
			} else if (dobleCapturaCtrl.patron == 'texto') {
				dobleCapturaCtrl.expresion = /^[A-Z\sÁÉÍÓÚñÑÜü.]*$/;
			} else if (dobleCapturaCtrl.patron == 'numerico') {
				dobleCapturaCtrl.expresion = /^[0-9]*$/;
			} else if (dobleCapturaCtrl.patron == 'correo') {
				dobleCapturaCtrl.expresion = /^[a-zA-Z0-9!#$%''\*\+-/=\?^_`\{|\}~]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]{2,4}$/;
			}
		}

		function dobleCapturaEnter() {
			$log.info('dobleCaptura');

			if ($scope.valor != null && $scope.valor != ''
					&& $scope.valor != undefined
					&& dobleCapturaCtrl.valor != $scope.valor) {

				if (dobleCapturaCtrl.patron != null
						&& dobleCapturaCtrl.patron != ''
						&& dobleCapturaCtrl.patron != undefined) {

					$log.info(dobleCapturaCtrl.expresion);

					if (dobleCapturaCtrl.expresion.test($scope.valor)) {
						dobleCapturaCtrl.valor = $scope.valor;
						dobleCapturaCtrl.visible = false;
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
												+ dobleCapturaCtrl.patron
														.toUpperCase());
					}
				} else {
					dobleCapturaCtrl.valor = $scope.valor;
					dobleCapturaCtrl.visible = false;
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
				templateUrl : 'modal.html',
				controller : 'modalDobleCapturaController',
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
				dobleCapturaCtrl.visible = true;
				var nextTabIndex = parseInt($scope.index) + 2;
				$("[tabindex=" + nextTabIndex + "]").focus();
			}, function() {
				dobleCapturaCtrl.visible = true;
				$scope.valor = '';

				$timeout(function() {
					var nextTabIndex = parseInt($scope.index);
					$("[tabindex=" + nextTabIndex + "]").focus();
				}, 500);
				dobleCapturaCtrl.valor = null;
			});

		}

	}

	modalDobleCapturaController.$inject = [ '$log', '$scope', 'AdeaServicios',
			'$filter', '$compile', 'ProformaServicios', 'FacturacionServicios',
			'$window', 'MantenimientoFacServicios', '$uibModalInstance' ];

	function modalDobleCapturaController($log, $scope, AdeaServicios, $filter,
			$compile, ProformaServicios, FacturacionServicios, $window,
			MantenimientoFacServicios, $uibModalInstance) {

		var modalCtrl = this;

		modalCtrl.validaDobleCaptura = validaDobleCaptura;

		function validaDobleCaptura() {
			if ($scope.recaptura == $scope.valor) {
				$uibModalInstance.close($scope.recaptura);
			} else {
				$window.document.getElementById($scope.identificador + 'DC')
						.focus();
			}

		}
	}

	dobleCaptura.$inject = [ '$log' ];
	function dobleCaptura($log) {
		var directiva = {
			controller : dobleCapturaController,
			restrict : 'E',
			controllerAs : 'dobleCapturaCtrl',
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
			templateUrl : 'app/directivas/adeaDobleCaptura/adeaDobleCaptura.html'

		};

		return directiva;
	}
	
})();
