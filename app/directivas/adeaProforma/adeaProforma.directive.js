(function () {

    /**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
    angular
        .module('adeaDirectivas')
        .controller('Proforma', Proforma)
        .directive('adeaProforma', adeaProforma);

    adeaProforma.$inject = ['$log'];
    Proforma.$inject = ['$log', '$scope', 'AdeaServicios', '$filter', '$compile', 'ProformaServicios', 'FacturacionServicios', '$window', 'MantenimientoFacServicios'];

    function Proforma($log, $scope, AdeaServicios, $filter, $compile, ProformaServicios, FacturacionServicios, $window, MantenimientoFacServicios) {

        var proformaCtrl = this;
        
        proformaCtrl.proforma = null;
        proformaCtrl.descargarProforma = descargarProforma;
        proformaCtrl.downloadArchivoFact = downloadArchivoFact;
        proformaCtrl.addProforma = addProforma;
        proformaCtrl.eliminarItem = eliminarItem;
        proformaCtrl.suma = suma;
        
        proformaCtrl.itemNuevo = {};
        proformaCtrl.itemNuevo.precioUnitario = 0;
        proformaCtrl.itemNuevo.cantidad = 0;
        proformaCtrl.itemNuevo.subtotal = 0;

        activar();

        function activar() {
            $log.info("Entra al metodo activar() de la directiva adeaProforma");
            consultaProforma();
            consultaItems();
            consultaCatGral();
        }
        
        function consultaProforma(){
        	$log.info('consultaProforma');
            
        	var promesa = ProformaServicios.consultaProforma($scope.parametros).$promise;

        	promesa.then(function (respuesta) {
        		proformaCtrl.proforma = respuesta;
        	});

        	promesa.catch(function (error) {
        		AdeaServicios.alerta("error", "Error al generar la proforma");
        	});
        }
        
        function descargarProforma(){
        	html2canvas(document.getElementById('bodyProforma'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("proforma.pdf");
                }
            });
        	
        	angular.element('#printProforma').modal('hide');
        }
        
        function downloadArchivoFact(nombreArchivo){
        	
        	var param = {
        			pcNombre: nombreArchivo, 
        			pcRuta: 'out'
        	};
        	

            var descarga = FacturacionServicios.archivoDownload(param).$promise;

            descarga.then(function (dato) {
            	var blob = dato.response.blob;
            	($window).saveAs(blob, nombreArchivo);
            });
            
            descarga.catch(function (respuesta) {
            	$log.error(respuesta)
            });
        }
        
        function addProforma(){
        	
        	proformaCtrl.itemNuevo.idProformaCab = proformaCtrl.proforma.idProformaCab;
        	
        	var promesa = ProformaServicios.addProforma(proformaCtrl.itemNuevo).$promise;

        	promesa.then(function (respuesta) {
        		if(respuesta.error == 'ok'){
        			AdeaServicios.alerta("success", "Se guardo el Item de Manera satisfactoria, la proforma se recalculo, favor de validar");
        			angular.element('#addItemProforma').modal('hide');
        			consultaProforma();
        			 proformaCtrl.itemNuevo = {};
        			 proformaCtrl.itemNuevo.precioUnitario = 0;
        			 proformaCtrl.itemNuevo.cantidad = 0;
        			 proformaCtrl.itemNuevo.subtotal = 0;
        		}else{
        			AdeaServicios.alerta("error", "Ocurrio un error al guardar el Item: " +respuesta.error);
        		}
        	});

        	promesa.catch(function (error) {
        		AdeaServicios.alerta("error", "Error al generar la proforma");
        	});
        }
        
        function consultaItems() {
			 $log.info('consultaItems');
	     	        	
			 var promesa = MantenimientoFacServicios.consultaItems().$promise;
		
			 promesa.then(function (respuesta) {

				 proformaCtrl.items = respuesta;
					
				 if(proformaCtrl.items.length == 0){
					 AdeaServicios.alerta("error", "No existen configurados Items, favor de configurar un item");
				 }
				
			 });
				
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consultar los Items");
			 });
		}
		
		
        function consultaCatGral(){
        	
			 $log.info('consultaCarteraCli');
			 var params = {
					 grpCat: 'CAT_UNIDAD_FAC'
			 };
	        	
			 var promesa = AdeaServicios.consultaCatalogoGral(params).$promise;

			 promesa.then(function (respuesta) {
				 proformaCtrl.catUnidad = respuesta;
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta Catalgos Unidad");
			 });
		 }
        
        function eliminarItem(){
        	$log.info('eliminarItem');
        
	        	
			 var promesa = ProformaServicios.delProforma(proformaCtrl.itemSeleccionado).$promise;

			 promesa.then(function (respuesta) {
				 AdeaServicios.alerta("success", "Se elimino el Item de Manera satisfactoria, la proforma se recalculo, favor de validar");
     			angular.element('#eliminarProforma').modal('hide');
     			consultaProforma();
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta Catalgos Unidad");
			 });
        }
        
        function suma(){
        	var subTotal = proformaCtrl.itemNuevo.precioUnitario * proformaCtrl.itemNuevo.cantidad;
        	proformaCtrl.itemNuevo.subtotal = Number(subTotal.toFixed(2));
        }
        
    }


    adeaProforma.$inject = ['$log'];
    function adeaProforma() {
        var directiva = {
            controller: Proforma,
            restrict: 'E',
            controllerAs: 'proformaCtrl',
            transclude: true,
            scope: {
                parametros: '=',
                periodo: '=?',
                modo: '=?'
            },
            templateUrl: 'app/directivas/adeaProforma/adeaProforma.html'
        };

        return directiva;
    }
})();
