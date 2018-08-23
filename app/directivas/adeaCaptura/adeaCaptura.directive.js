(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas').controller('Captura', Captura).directive(
			'adeaCaptura', adeaCaptura).controller('modalAutorizacionController', modalAutorizacionController);
;

	Captura.$inject = [ '$log', '$scope', 'CapturaServicios', '$filter', '$compile', 'AdeaServicios', '$window', '$timeout', '$uibModal'];

	function Captura($log, $scope, CapturaServicios, $filter, $compile, AdeaServicios, $window, $timeout, $uibModal) {

		var capturaCtrl = this

		capturaCtrl.validaEtiquetaS = validaEtiquetaS;
		capturaCtrl.validaEtiquetaU = validaEtiquetaU;
		capturaCtrl.cerrarUbicacion = cerrarUbicacion;
		capturaCtrl.cerrarSecuencia = cerrarSecuencia;
		capturaCtrl.validaGuardar = validaGuardar;
		$scope.validaAutorizacion = validaAutorizacion;
		
		capturaCtrl.guardar = guardar;
		capturaCtrl.validaOp = $scope.validOp;
		capturaCtrl.numeroAutorizazion = '';

		
		capturaCtrl.captura = {};
		capturaCtrl.bndValidaS = false;
		capturaCtrl.bndValidaU = true;
		capturaCtrl.expCap = 0;
		capturaCtrl.expIng = 0; 
		$scope.validOp = true;

		capturaCtrl.captura.now = moment(new Date()).format('DD/MM/YYYY');
		
		$timeout(function(){
			var ubicacion = $window.document.getElementById('ubicacion');
			ubicacion.focus();
		}, 500);

		function validaEtiquetaS() {
		
			var capturaEtiqueta = {
				etiqueta: capturaCtrl.captura.ubicacion,
				operatoriaCfg: $scope.operatoriaCfg
			};
			
			$log.info(capturaEtiqueta.etiqueta);
			
			if(capturaEtiqueta.etiqueta != null && capturaEtiqueta.etiqueta != undefined && capturaEtiqueta.etiqueta != ''){
				validaEtiquetaGeneral(capturaEtiqueta, 'S');
			}else{
				AdeaServicios.alerta("error",  "Formato Invalido de la Etiqueta");
			}

		}
		
		function validaEtiquetaU() {
			
			var capturaEtiqueta = {
					etiqueta: capturaCtrl.captura.secuencia,
					operatoriaCfg: $scope.operatoriaCfg,
					idCaja: capturaCtrl.captura.ubicacion
			};
			
			if(capturaEtiqueta.etiqueta != null && capturaEtiqueta.etiqueta != undefined && capturaEtiqueta.etiqueta != ''){
				validaEtiquetaGeneral(capturaEtiqueta, 'U');
			}else{
				AdeaServicios.alerta("error",  "Formato Invalido de la Etiqueta");
			}

		}
		
		function validaEtiquetaGeneral(params, tipo){
			

			var promesa = CapturaServicios.validaEtiquetaGral(params).$promise;
			
			promesa.then(function (respuesta) {
				$log.info(respuesta);
				 if (respuesta.error != null && respuesta.error != undefined && respuesta.error != '' && respuesta.error != 'ok') {
					 AdeaServicios.alerta("error",  respuesta.error);
					 
					 if(tipo == 'S'){
						 capturaCtrl.bndValidaS = false;
						 capturaCtrl.bndValidaU = true;
					 }else{
						 capturaCtrl.bndValidaS = true;
						 capturaCtrl.bndValidaU = false;
					 }

				 } else if(respuesta.error == null && respuesta.vwEtiquetaCap == undefined && respuesta.vwEtiquetaCap == null){
					 
					 
					 if(respuesta.tipoUsuarioValue == '' && respuesta.tipoUsuarioValue == undefined && respuesta.tipoUsuarioValue == null){
						 AdeaServicios.alerta("error",  'LA ETIQUETA NO CUMPLE CON EL FORMATO');
						 
						 if(tipo == 'S'){
							 capturaCtrl.bndValidaS = false;
							 capturaCtrl.bndValidaU = true;
						 }else{
							 capturaCtrl.bndValidaS = true;
							 capturaCtrl.bndValidaU = false;
						 }
					 }else{
						 delete respuesta.ubicacion;
						 delete respuesta.secuencia;
						 delete respuesta.operatoriaCfg;
						 
						 $scope.datosCaptura = respuesta;
						 capturaCtrl.bndValidaS = true;
						 capturaCtrl.bndValidaU = true;
						 capturaCtrl.captura.docAdea = respuesta.docAdea;
						 $scope.valid = false;
						 $scope.bndModo = 'M';
					 }
				 }else{
					 if(tipo == 'S'){
						 capturaCtrl.bndValidaS = true;
						 capturaCtrl.bndValidaU = false;
						 capturaCtrl.expCap = respuesta.expCap;
						 capturaCtrl.expIng = respuesta.expIng; 
					 }else{
						 capturaCtrl.bndValidaS = true;
						 capturaCtrl.bndValidaU = true;
						 capturaCtrl.captura.docAdea = respuesta.vwEtiquetaCap.docadeaclt;
						 $scope.valid = true;
					 }
					 $scope.bndModo = 'A';
				 }
			});
	            
			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al validar la etiqueta: " + error.data);
			})
		}
		
		function cerrarUbicacion(){
			$log.info('cerrarUbicacion');
		    capturaCtrl.bndValidaS = false;
		    capturaCtrl.bndValidaU = true;  
		    capturaCtrl.captura ={};
		    capturaCtrl.captura.now = moment(new Date()).format('DD/MM/YYYY');
		    capturaCtrl.expCap = 0;
			capturaCtrl.expIng = 0; 
			$scope.valid = false;
			$scope.limpiaForm();
			$timeout(function(){
				var ubicacion = $window.document.getElementById('ubicacion');
				ubicacion.focus();
			}, 500);		
		}
		
		function cerrarSecuencia(){
			$log.info('cerrarSecuencia');
		    capturaCtrl.bndValidaS = true;
		    capturaCtrl.bndValidaU = false;  
		    capturaCtrl.captura.secuencia = null;
		    capturaCtrl.captura.docAdea = null;
		    $scope.valid = false;
		    $scope.valid = false;
		    $scope.limpiaForm();
			$timeout(function(){
				var secuencia = $window.document.getElementById('secuencia');
				secuencia.focus();
			}, 500);
		}
		
		function guardar(){
			$log.info('guardarCaptura');
			
			$scope.datosCaptura.ubicacion = capturaCtrl.captura.ubicacion;
			$scope.datosCaptura.secuencia = capturaCtrl.captura.secuencia;
			$scope.datosCaptura.docAdea = capturaCtrl.captura.docAdea;
			$scope.datosCaptura.operatoriaCfg = $scope.operatoriaCfg;
			$scope.datosCaptura.idAutorizacion = capturaCtrl.idAutorizacion;
			
			 var promesa = CapturaServicios.guardarCaptura($scope.datosCaptura).$promise;

			 promesa.then(function (respuesta) {
				 cerrarSecuencia();
				 AdeaServicios.alerta("succes", "La captura se guardo de manera Satisfactoria");
			     $scope.datosCaptura.idAutorizacion = null; 
			     capturaCtrl.idAutorizacion = null
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al guardar la captura");
			 });
			
		}
		
		function validaGuardar(){
			$log.info('validaGuardar');
			$log.info($scope.autorizacion);
			if($scope.autorizacion){
				angular.element('#autorizacionMdl').modal('show');
				
				$timeout(function() {
					var autoriza = $window.document.getElementById('autoriza');
					autoriza.focus();
				}, 500);
			}else{
				guardar();
			}
		}
		
		function open() {
			var modalinstance = $uibModal.open({
				scope : $scope,
				templateUrl : 'autorizacionM.html',
				controller : 'modalAutorizacionController',
				controllerAs : 'modalAutorizaCtrl',
				resolve : {
					valor : function() {
						return capturaCtrl.idAutorizacion;
					}
				},
				backdrop : 'static'
			});

			modalinstance.result.then(function() {
				$log.info('Modal : ' + new Date());
				
				
			}, function() {
				$log.info('Ejecuta : ' + new Date());
				
			});

		}
		
		function validaAutorizacion(idAutorizacion) {
			$log.info('validaAutorizacion : ' + new Date());
			$log.info(idAutorizacion);
			
			capturaCtrl.idAutorizacion = idAutorizacion;
			
			var autorizacion = {
					codigoAutorizacion: idAutorizacion,
					tipoAut: 'numAutorizacion'
			};
			
			 var promesa = CapturaServicios.validaAutorizacion(autorizacion).$promise;

			 promesa.then(function (respuesta) {
				 
				 if(respuesta.error != null && respuesta.error != undefined && respuesta.error != ''){
					 AdeaServicios.alerta("error", respuesta.error);
				 }else{
					 guardar();
					 angular.element('#autorizacionMdl').modal('hide');
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al guardar la captura");
			 });

			
		}

	}
	
	modalAutorizacionController.$inject = [ '$log', '$scope', 'AdeaServicios',
		'$filter', '$compile', 'ProformaServicios', 'FacturacionServicios',
		'$window', 'MantenimientoFacServicios', '$uibModalInstance', 'CapturaServicios' ];

	function modalAutorizacionController($log, $scope, AdeaServicios, $filter,
			$compile, ProformaServicios, FacturacionServicios, $window,
			MantenimientoFacServicios, $uibModalInstance, CapturaServicios) {
	
		var modalAutorizaCtrl = this;
	
		
	}

	adeaCaptura.$inject = [ '$log' ];
	function adeaCaptura() {
		var directiva = {
			controller : Captura,
			restrict : 'E',
			controllerAs : 'capturaCtrl',
			transclude : true,
			scope : {
				titulo : '=?',
				operatoriaCfg : '=?',
				valid : '=?',
				limpiaForm : '&',
				form: '=',
				validOp: '&?',
				datosCaptura: '=',
				bndModo: '=?',
				autorizacion: '=',
				validaAutorizacion: '=?'
			},
			templateUrl : 'app/directivas/adeaCaptura/adeaCaptura.html'
		};

		return directiva;
	}
})();
