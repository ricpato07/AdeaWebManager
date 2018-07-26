(function() {
	'use strict';

	angular.module('adeaModule').controller('MntCarteraClienteFacController',
			MntCarteraClienteFacController);

	MntCarteraClienteFacController.$inject = [ '$log', 'tblCarteraFac',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'tblCostosPlantilla', 'AdeaServicios', '$window', 'MantenimientoFacServicios'];

	function MntCarteraClienteFacController($log, tblCarteraFac, proyectoServicios,
			FacturacionServicios, $timeout, tblCostosPlantilla, AdeaServicios, $window, MantenimientoFacServicios) {

		var mntCarteraClienteFacCtrl = this;
		
		
		mntCarteraClienteFacCtrl.tblCarteraFac = tblCarteraFac;
		
		mntCarteraClienteFacCtrl.consultaCarteraCli = consultaCarteraCli;
		mntCarteraClienteFacCtrl.seleccionarCartera = seleccionarCartera;
		mntCarteraClienteFacCtrl.initAgregarCartera = initAgregarCartera;
		mntCarteraClienteFacCtrl.initEditarCartera = initEditarCartera;
		mntCarteraClienteFacCtrl.agregarCartera = agregarCartera;
		mntCarteraClienteFacCtrl.editarCartera = editarCartera;
		mntCarteraClienteFacCtrl.noHaCambiado = noHaCambiado;
		
		mntCarteraClienteFacCtrl.labelsMultiselect = {
	        	    "itemsSelected": "Usuario Seleccionado",
	        	    "selectAll": "Seleccionar Todos",
	        	    "unselectAll": "Borrar Todos",
	        	    "search": "Buscar",
	        	    "select": "Seleccione"
	        	}

		activar();

		function activar() {
			consultaClientes();
			consultaUsuariosMx();
		}

		 function consultaCarteraCli(){
	        	
			 $log.info('consultaCarteraCli');
	        	
			 var params = {
					 scltcod: mntCarteraClienteFacCtrl.idClienteSeleccionado
			 };
	        	
			 var promesa = FacturacionServicios.consultaCarteraCliente(params).$promise;

			 promesa.then(function (respuesta) {
				 mntCarteraClienteFacCtrl.carteraCliente = respuesta;
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function consultaClientes() {

            var promesa = FacturacionServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {
            	
            	if(respuesta.length > 0){
            		
            		mntCarteraClienteFacCtrl.clientes = respuesta;
            		
            		if(mntCarteraClienteFacCtrl.clientes.length == 1){
            			$log.info('consultaClientes');
            			mntCarteraClienteFacCtrl.idClienteSeleccionado = mntCarteraClienteFacCtrl.clientes[0].scltcod;
            			mntCarteraClienteFacCtrl.bndSeleCliente = true;
            			// consultaPeriodos(facturacionCtrl.idClienteSeleccionado);
            			consultaCarteraCli();
            		}
            	}else{
            		AdeaServicios.alerta("error", "No existen clientes para Facturar");
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los clientes para Facturación");
            })
        }
		
		function seleccionarCartera(reg){
			$log.info('seleccionarCartera');
			
			mntCarteraClienteFacCtrl.carteraSeleccionado = reg;
			mntCarteraClienteFacCtrl.carteraEditable = angular.copy(mntCarteraClienteFacCtrl.carteraSeleccionado);
		}
		
		function initAgregarCartera(){
			 
			consultaCatGral();
			consultaCatLay();
			
			
			angular.element('#agregarCartera').modal('show');
		}
		
		function initEditarCartera(){

			consultaCatGral();
			consultaCatLay();
		}
		
		
		function consultaCatGral(){
	        	
			 $log.info('consultaCarteraCli');
			 var params = {
					 grpCat: 'CAT_PERIODO_FAC'
			 };
	        	
			 var promesa = AdeaServicios.consultaCatalogoGral(params).$promise;

			 promesa.then(function (respuesta) {
				 
					 mntCarteraClienteFacCtrl.catPeriodo = respuesta;

				 
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function consultaCatLay(){
        	
			 $log.info('consultaCatLay');
			 var params = {
					 grpCat: 'CAT_LAYOUT_FAC'
			 };
	        	
			 var promesa = AdeaServicios.consultaCatalogoGral(params).$promise;

			 promesa.then(function (respuesta) {
				 
					 mntCarteraClienteFacCtrl.catLayout = respuesta;

				 
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		
		  
		function consultaUsuariosMx() {
			$log.info('consultaUsuariosMx');

			var promesa = AdeaServicios.consultaUsuarioMx().$promise;
	            
			promesa.then(function (respuesta) {
				mntCarteraClienteFacCtrl.usersMx = respuesta;
	                
				if (mntCarteraClienteFacCtrl.usersMx.length == 0) {
					AdeaServicios.alerta("error", "No existen usuario con la cadena Capturada");
				}
			});
	            
			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta las Usuarios de Adea: " + error.data);
			})
		}
		
		function agregarCartera(){
			$log.info('agregarCartera');
			$log.info(mntCarteraClienteFacCtrl.carteraNueva);
			
			angular.forEach(mntCarteraClienteFacCtrl.carteraNueva.listaUsuario, function (obj) {
            	delete obj.nombre;
            	delete obj.estatus;
            	delete obj.email;
            });
			
			var promesa = MantenimientoFacServicios.insertarCartera(mntCarteraClienteFacCtrl.carteraNueva).$promise;
			
			promesa.then(function (respuesta) {
				if(respuesta.idCarteraCliente!= null){
					angular.element('#agregarCartera').modal('hide');
					consultaCarteraCli();
					mntCarteraClienteFacCtrl.carteraNueva = null;
					mntCarteraClienteFacCtrl.carteraSeleccionado = null;
					AdeaServicios.alerta("success", "La cartera se registro de manera existosa");
				}else{
					AdeaServicios.alerta("error", respuesta.error);
				}
			});
	            
			promesa.catch(function (error) {
				AdeaServicios.alerta("error", "Error al consulta las Usuarios de Adea: " + error.data);
			})
			
			$log.info(mntCarteraClienteFacCtrl.carteraNueva);
		}
		
		function noHaCambiado(){
			  var bndCambio = false;
			  
			if(!angular.equals(mntCarteraClienteFacCtrl.carteraEditable, mntCarteraClienteFacCtrl.carteraSeleccionado)){
				  bndCambio = true;
			}
			
			return bndCambio;
		}
		
		
		function editarCartera(){
			$log.info('editarCartera');
			angular.forEach(mntCarteraClienteFacCtrl.carteraEditable.listaUsuario, function (obj) {
            	delete obj.nombre;
            	delete obj.estatus;
            	delete obj.email;
            });
			
			var promesa = MantenimientoFacServicios.editarCartera(mntCarteraClienteFacCtrl.carteraEditable).$promise;

			promesa.then(function (respuesta) {
				
				if(respuesta.error == 'ok'){
					consultaCarteraCli();
					angular.element('#editarCartera').modal('hide');
					AdeaServicios.alerta("success", "Se Modifico la cartera de manera Satisfactoria");
				}else{
					AdeaServicios.alerta("error", "Ocurrio un Error al editar la Cartera: " + respuesta.error);
				}
			});

	            promesa.catch(function (error) {
	                AdeaServicios.alerta("error", "Error al editar la Cartera: " + error.data.error);
	            })
			
		}
	}
})();