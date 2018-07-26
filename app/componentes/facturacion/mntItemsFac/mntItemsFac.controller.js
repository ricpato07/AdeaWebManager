(function() {
	'use strict';

	angular.module('adeaModule').controller('MntItemsFacController',
			MntItemsFacController);

	MntItemsFacController.$inject = [ '$log', 'tblItemsFac',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'AdeaServicios', '$window', 'MantenimientoFacServicios' ];

	function MntItemsFacController($log, tblItemsFac, proyectoServicios,
			FacturacionServicios, $timeout, AdeaServicios, $window,
			MantenimientoFacServicios) {

		var mntItemsFacCtrl = this;

		activar();
		
		mntItemsFacCtrl.tblItemsFac = tblItemsFac;
		mntItemsFacCtrl.seleccionarItem = seleccionarItem;
		mntItemsFacCtrl.agregarItem = agregarItem;
		mntItemsFacCtrl.editarItem = editarItem;
		mntItemsFacCtrl.noHaCambiado = noHaCambiado;
		
		mntItemsFacCtrl.estatus = [{codigo: 'A', descripcion: 'Activo'}, {codigo: 'I', descripcion: 'Inactivo'}];

		function activar() {
			consultaItems();
		}
		
		
		function consultaItems() {
		 $log.info('consultaCarteraCli');
     	        	
		 	var promesa = MantenimientoFacServicios.consultaItems().$promise;
	
			promesa.then(function (respuesta) {
				mntItemsFacCtrl.items = respuesta;
			});
			 
			promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		}
		
		function seleccionarItem(reg){
			mntItemsFacCtrl.itemSeleccionado = reg;
			mntItemsFacCtrl.itemEditable = angular.copy(mntItemsFacCtrl.itemSeleccionado);
		}
		
		function agregarItem(){
			
			var promesa = MantenimientoFacServicios.insertaItems(mntItemsFacCtrl.itemNuevo).$promise;
			
			promesa.then(function (respuesta) {
				if(respuesta.idCatalogoItem != null){
					angular.element('#agregarItem').modal('hide');
					consultaItems();
					mntItemsFacCtrl.itemNuevo = null;
					mntItemsFacCtrl.itemSeleccionado = null;
					AdeaServicios.alerta("success", "El item se registro de manera existosa");
				}else{
					AdeaServicios.alerta("error", respuesta.error);
				}
			});
			 
			promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
			
		}
		
		function editarItem(){
			
			var promesa = MantenimientoFacServicios.editaItems(mntItemsFacCtrl.itemEditable).$promise;
			
			promesa.then(function (respuesta) {
				if(respuesta.error == 'ok'){
					consultaItems();
					angular.element('#editarItem').modal('hide');
					AdeaServicios.alerta("success", "Se Modifico el Item de manera Satisfactoria");
				}else{
					AdeaServicios.alerta("error", "Ocurrio un Error al editar el Item: " + respuesta.error);
				}
			});
			 
			promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al actualizar el Item");
			 });
		}
		
		function noHaCambiado(){
			  var bndCambio = false;
			  
			if(!angular.equals(mntItemsFacCtrl.itemEditable, mntItemsFacCtrl.itemSeleccionado)){
				  bndCambio = true;
			}
			
			return bndCambio;
		}

	}
})();