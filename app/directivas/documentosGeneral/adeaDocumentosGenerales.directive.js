(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:XsDocumetosGeneralesController
	 * @restrict E
	 * @description Diretiva que se subir los docuemtnos generales dentro de la
	 *              aplicacion, como pdf, imagenes, xml en los diferentes
	 *              modulos
	 */
	angular.module('adeaDirectivas').controller(
			"adeaDocumetosGeneralesController",
			adeaDocumetosGeneralesController).directive(
			'adeaDocumentosGenerales', adeaDocumentosGenerales);

	adeaDocumetosGeneralesController.$inject = [ '$scope', 'FileUploader',
			'serviceUrl', '$log', 'AdeaServicios', '$filter' ];

	function adeaDocumetosGeneralesController($scope, FileUploader, serviceUrl,
			$log, AdeaServicios, $filter) {

		/* variable del controller as */
		var adeaDocumentosGeneralesCtrl = this;

		/* Servicio especifico para subir una imagen */

		var uploader = $scope.uploader = new FileUploader();
		
		adeaDocumentosGeneralesCtrl.guardarArchivo = guardarArchivo;
		adeaDocumentosGeneralesCtrl.eliminarArchivo = eliminarArchivo;

		// CALLBACKS

		/**
		 * @ngdoc service
		 * @name xsAdmin.XsDocumetosGeneralesController#onBeforeUploadItem
		 * @methodOf xsAdmin.directive:XsDocumetosGeneralesController
		 * @descripcion Funcion que es la encargada de subir los archivos al
		 *              servidor
		 * 
		 * @param {File}
		 *            item : item seleccionada
		 */
		uploader.onBeforeUploadItem = function(item) {

			$log.info('----onBeforeUploadItem');

			item.url = $scope.urlServicio;

			if ($scope.tipo == 'ticket') {
				enviaTicket(item);
			}
			// item.formData = [{form: $scope.form}];

			// $log.info(item.formData);

		};

		function enviaTicket(item) {
			item.formData = [ {
				categoria : $scope.form.categoria,
				prioridad : $scope.form.prioridad,
				idArea : $scope.form.idArea,
				resumen : $scope.form.resumen,
				extension : $scope.form.extension,
				planta : $scope.form.planta,
				descripcion : $scope.form.descripcion
			} ];
		}

		/**
		 * @ngdoc method
		 * @name xsAdmin.XsDocumetosGeneralesController#onAfterAddingFile
		 * @methodOf xsAdmin.directive:XsDocumetosGeneralesController
		 * @description Funcion que se ejecuta despues de que se elije la imagen
		 */
		uploader.onAfterAddingFile = function(fileItem) {
			$log
					.info("Entra al metodo onAfterAddingFile() de la directiva XsDocumetosGeneralesController");
			
			$log.info($scope.extencion);

			if (fileItem.file.size > 5000000) {
				AdeaServicios
						.alerta("error",
								'Tamaño no permitido, El tamaño del archivo no debe exceder los 5Mb');
				uploader.removeFromQueue(fileItem);
			} else if ($scope.extencion != null && $scope.extencion != '' && $scope.extencion != undefined){
				
				$log.info(fileItem.file.name.search('.xls'));
				if(fileItem.file.name.search($scope.extencion) == -1) {
					AdeaServicios.alerta("error", "Solo se puede adjuntar archivos del tipo: "+ $scope.extencion);
					uploader.removeFromQueue(fileItem);
				}
            } else {

				if (fileItem.file.name.match(/[\%\-\#\,]/)) {
					AdeaServicios
							.alerta(
									"error",
									'Caracteres no permitidos, El nombre del archivo contiene alguno de los siguientes caracteres: , - # % { } ( ) + ');
					uploader.removeFromQueue(fileItem);
				} else {
					var repetidos = 0;
					angular.forEach(uploader.queue, function(data) {
						if (data.file.name == fileItem.file.name) {
							repetidos++;
						}
						if (repetidos > 1) {
							AdeaServicios.alerta("error", 'El Archivo '
									+ fileItem.file.name
									+ ' ya se encuanta en tu lista! ');
							uploader.removeFromQueue(fileItem);
						}
					});
				}
			}
			
			if(uploader.queue.length > 0){
				$scope.file = uploader.queue[0]._file;
			}
		};

		function guardarArchivo() {
			$log.info('--------------------------Guarda');
			uploader.queue[0].upload();
			$scope.guardar();
		}
		
		function eliminarArchivo(fileItem){
			uploader.removeFromQueue(fileItem);
			$scope.file = null;
		}

	}

	adeaDocumentosGenerales.$inject = [];

	function adeaDocumentosGenerales() {
		var directive = {
			controller : adeaDocumetosGeneralesController,
			controllerAs : 'adeaDocumentosGeneralesCtrl',
			restrict : 'E',
			scope : {
				form : '=?',
				formValid : '=?',
				urlServicio : '=?',
				tipo : '=?',
				guardar : '&?',
				file: '=?',
				extencion: '=?'
			},
			templateUrl : 'app/directivas/documentosGeneral/adeaDocumentosGenerales.html'
		};
		return directive;
	}
}());