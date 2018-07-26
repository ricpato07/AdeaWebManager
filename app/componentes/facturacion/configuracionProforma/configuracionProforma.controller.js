(function() {
	'use strict';

	angular.module('adeaModule').controller('ConfiguracionProformaController',
			ConfiguracionProformaController);

	ConfiguracionProformaController.$inject = [ '$log', 'tblConfigProforma',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'AdeaServicios', '$window', 'MantenimientoFacServicios' ];

	function ConfiguracionProformaController($log, tblConfigProforma, proyectoServicios,
			FacturacionServicios, $timeout, AdeaServicios, $window,
			MantenimientoFacServicios) {

		var configuracionProformaCtrl = this;
		
		configuracionProformaCtrl.tblConfigProforma =  tblConfigProforma;
		
		configuracionProformaCtrl.consConfProforma = consConfProforma;
		configuracionProformaCtrl.seleccionarConf = seleccionarConf;
		configuracionProformaCtrl.agregarConf = agregarConf; 
		configuracionProformaCtrl.noHaCambiado = noHaCambiado;
		configuracionProformaCtrl.editarItem = editarItem;
		
		activar();
		
		function activar(){
			consultaCartera();
			consultaItems();
			consultaCatGral();
		}
		
		function consultaCartera(){
        	
			 $log.info('consultaCarteraCli');
	        	
			 var promesa = FacturacionServicios.consultaCarteraCliente().$promise;

			 promesa.then(function (respuesta) {
				 configuracionProformaCtrl.carteraCliente = respuesta;
				 configuracionProformaCtrl.idCarteraSeleccionado = configuracionProformaCtrl.carteraCliente[0].idCarteraCliente;
				 $log.info('terminaaa aqui');
				 consConfProforma();
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function consConfProforma(){
        	
			 $log.info('consultaConfiguracionProforma');
			 
			 var params = {
					 idCartera: configuracionProformaCtrl.idCarteraSeleccionado
			 };
	        	
			 var promesa = FacturacionServicios.consultaConfiguracionProforma(params).$promise;

			 promesa.then(function (respuesta) {
				 configuracionProformaCtrl.configuracionProforma = respuesta;
				 consultaCatalogos();
				 if(configuracionProformaCtrl.configuracionProforma == 0){
					 AdeaServicios.alerta("error", "No existen configuraciones de proforma para la cartera Seleccionada");
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function seleccionarConf(reg){
			configuracionProformaCtrl.confSeleccionado = reg;
			configuracionProformaCtrl.itemEditable = angular.copy(configuracionProformaCtrl.confSeleccionado);
		}
		
		function consultaItems() {
			 $log.info('consultaItems');
	     	        	
			 var promesa = MantenimientoFacServicios.consultaItems().$promise;
		
			 promesa.then(function (respuesta) {
				 $log.info('consultaItems');
				 $log.info(respuesta);
				 configuracionProformaCtrl.items = respuesta;
					
				 if(configuracionProformaCtrl.items.length == 0){
					 AdeaServicios.alerta("error", "No existen configurados Items, favor de configurar un item");
				 }
				
			 });
				
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consultar los Items");
			 });
		}
		
		
		function consultaCatalogos(){
			
			 $log.info('consultaCatalogos');
			
			var params = {
					idCarteraCliente: configuracionProformaCtrl.idCarteraSeleccionado
			};
			
			
			var promesa = FacturacionServicios.consultaCatalogosGral(params).$promise;
			
			promesa.then(function (respuesta) {
				configuracionProformaCtrl.catalogos = respuesta;
				if(configuracionProformaCtrl.catalogos.length == 0){
					AdeaServicios.alerta("error", "La cartera Seleccionada no cuenta con Soportes de Facturación configurados");
				}
			});
			 
			promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consultar los catálogos");
			 });
		}
		
		function consultaCatGral(){
        	
			 $log.info('consultaCarteraCli');
			 var params = {
					 grpCat: 'CAT_UNIDAD_FAC'
			 };
	        	
			 var promesa = AdeaServicios.consultaCatalogoGral(params).$promise;

			 promesa.then(function (respuesta) {
				 configuracionProformaCtrl.catUnidad = respuesta;
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta Catalgos Unidad");
			 });
		 }
		
		function agregarConf(){
			$log.info('agregarConf');
			
			configuracionProformaCtrl.itemNuevo.idCarteraCliente = configuracionProformaCtrl.idCarteraSeleccionado;
	        	
			 var promesa = FacturacionServicios.altaConfiguracionProforma(configuracionProformaCtrl.itemNuevo).$promise;

			 promesa.then(function (respuesta) {
				 $log.info('todo fue un exito');
				 if(respuesta.idProformaCfg != null){
					 angular.element('#agregarCfgProforma').modal('hide');
					 AdeaServicios.alerta("success", "Se Modifico la cartera de manera Satisfactoria");
					 consConfProforma();
					 configuracionProformaCtrl.itemNuevo = null;
				 }else{
					 AdeaServicios.alerta("error", respuesta.error);
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta Catalgos Unidad");
			 });
		}
		
		function noHaCambiado(){
			  var bndCambio = false;
			  
			if(!angular.equals(configuracionProformaCtrl.itemEditable, configuracionProformaCtrl.confSeleccionado)){
				  bndCambio = true;
			}
			
			return bndCambio;
		}
		
		function editarItem(){
        	
			 var promesa = FacturacionServicios.editarConfiguracionProforma(configuracionProformaCtrl.itemEditable).$promise;

			 promesa.then(function (respuesta) {
				 $log.info('todo fue un exito');
				 if(respuesta.error == 'ok'){
					 angular.element('#editarCfgProforma').modal('hide');
					 AdeaServicios.alerta("success", "Se Modifico el Item de manera Satisfactoria");
					 consConfProforma();
				 }else{
					 AdeaServicios.alerta("error", respuesta.error);
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta Catalgos Unidad");
			 });
		}
		
	}
})();