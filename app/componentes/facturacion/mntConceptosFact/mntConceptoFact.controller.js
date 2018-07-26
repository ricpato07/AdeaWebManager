(function() {
	'use strict';

	angular.module('adeaModule').controller('MntConceptoFactController',
			MntConceptoFactController);

	MntConceptoFactController.$inject = [ '$log', 'tblCatalogosFac',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'AdeaServicios', '$window', 'MantenimientoFacServicios' ];

	function MntConceptoFactController($log, tblCatalogosFac, proyectoServicios,
			FacturacionServicios, $timeout, AdeaServicios, $window,
			MantenimientoFacServicios) {

		var mntConceptoFacCtrl = this;
		
		mntConceptoFacCtrl.tblCatalogosFac = tblCatalogosFac;
		
		mntConceptoFacCtrl.consultaCatalogos = consultaCatalogos;
		mntConceptoFacCtrl.seleccionarConcep = seleccionarConcep;
		mntConceptoFacCtrl.agregarConcepto = agregarConcepto;
		mntConceptoFacCtrl.editarConcepto = editarConcepto;
		mntConceptoFacCtrl.noHaCambiado= noHaCambiado;
		
		mntConceptoFacCtrl.labelsMultiselect = {
        	    "itemsSelected": "Usuario Seleccionado",
        	    "selectAll": "Seleccionar Todos",
        	    "unselectAll": "Borrar Todos",
        	    "search": "Buscar",
        	    "select": "Seleccione"
        	}
		
		
		activar();
		
		function activar(){
			consultaCartera();
			consultaItems();
		}
		
		
		function consultaCatalogos(){
			
			var params = {
					idCarteraCliente: mntConceptoFacCtrl.idCarteraSeleccionado
			};
			
			
			var promesa = FacturacionServicios.consultaCatalogosGral(params).$promise;
			
			promesa.then(function (respuesta) {
				mntConceptoFacCtrl.catalogos = respuesta;
				if(mntConceptoFacCtrl.catalogos.length == 0){
					AdeaServicios.alerta("error", "La cartera Seleccionada no cuenta con Soportes de Facturación configurados");
				}
			});
			 
			promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consultar los catálogos");
			 });
		}
		
		function consultaCartera(){
        	
			 $log.info('consultaCarteraCli');
	        	
			 var promesa = FacturacionServicios.consultaCarteraCliente().$promise;

			 promesa.then(function (respuesta) {
				 mntConceptoFacCtrl.carteraCliente = respuesta;
				 mntConceptoFacCtrl.idCarteraSeleccionado = mntConceptoFacCtrl.carteraCliente[0].idCarteraCliente;
				 consultaCatalogos();
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function seleccionarConcep(reg){
			mntConceptoFacCtrl.concepSeleccionado = reg;
			mntConceptoFacCtrl.concepEditable = angular.copy(mntConceptoFacCtrl.concepSeleccionado);
		}
		
		function consultaItems() {
			 $log.info('consultaCarteraCli');
	     	        	
			 var promesa = MantenimientoFacServicios.consultaItems().$promise;
		
			 promesa.then(function (respuesta) {
				 mntConceptoFacCtrl.items = respuesta;
					
				 if(mntConceptoFacCtrl.items.length == 0){
					 AdeaServicios.alerta("error", "No existen configurados Items, favor de configurar un item");
				 }
				
			 });
				
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consultar los Items");
			 });
		}
		
		function noHaCambiado(){
			  var bndCambio = false;
			  
			if(!angular.equals(mntConceptoFacCtrl.concepEditable, mntConceptoFacCtrl.concepSeleccionado)){
				  bndCambio = true;
			}
			
			return bndCambio;
		}
		
		function agregarConcepto(){
			$log.info('agregarConcepto');
			
			mntConceptoFacCtrl.conceptNuevo.idCarteraCliente = mntConceptoFacCtrl.idCarteraSeleccionado;
			angular.forEach(mntConceptoFacCtrl.conceptNuevo.soporteItems, function (obj) {
            	delete obj.descripcion;
            	delete obj.fechaReg;
            	delete obj.usuarioReg;
            	delete obj.estatus;
            });
			
			 var promesa = MantenimientoFacServicios.insertaConcepto(mntConceptoFacCtrl.conceptNuevo).$promise;
				
			 promesa.then(function (respuesta) {
				 
				 if(respuesta.idItemConcepto != null){
						angular.element('#agregarConcepto').modal('hide');
						consultaCatalogos();
						AdeaServicios.alerta("success", "El concepto se registro de manera existosa");
						mntConceptoFacCtrl.conceptNuevo = null;
						mntConceptoFacCtrl.concepSeleccionado = null;
					}else{
						AdeaServicios.alerta("error", respuesta.error);
					}
			 });
				
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al guardar el concepto");
			 });
		}
		
		function editarConcepto(){		
			
			angular.forEach(mntConceptoFacCtrl.concepEditable.soporteItems, function (obj) {
            	delete obj.descripcion;
            	delete obj.fechaReg;
            	delete obj.usuarioReg;
            	delete obj.estatus;
            	obj.idItemConcepto = mntConceptoFacCtrl.concepSeleccionado.idItemConcepto;
            });
			
			var promesa = MantenimientoFacServicios.editarConcepto(mntConceptoFacCtrl.concepEditable).$promise;
			
			 promesa.then(function (respuesta) {
				 if(respuesta.error == 'ok'){
					 consultaCatalogos();
					 angular.element('#editarConcepto').modal('hide');
					 AdeaServicios.alerta("success", "Se Modifico el concepto de manera Satisfactoria");
				 }else{
					 AdeaServicios.alerta("error", "Ocurrio un Error al editar el concepto: " + respuesta.error);
				 }
			 });
				
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al guardar el concepto");
			 });
		}
	}
})();