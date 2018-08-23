(function() {
	'use strict';

	angular.module('adeaModule').controller('ConsultaFacturacionController',
			ConsultaFacturacionController);

	ConsultaFacturacionController.$inject = [ '$log',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'tblPeriodosFacturacion', 'AdeaServicios', '$window', 'MantenimientoFacServicios'];

	function ConsultaFacturacionController($log, proyectoServicios,
			FacturacionServicios, $timeout, tblPeriodosFacturacion, AdeaServicios, $window, MantenimientoFacServicios) {

		var consultaFacturacionCtrl = this;
		
		consultaFacturacionCtrl.tblPeriodosFacturacion = tblPeriodosFacturacion;
		
		consultaFacturacionCtrl.consultaCarteraCli = consultaCarteraCli;
		consultaFacturacionCtrl.consultaPeriodosGenerales = consultaPeriodosGenerales;
		consultaFacturacionCtrl.consultaPeriodos = consultaPeriodos;
		consultaFacturacionCtrl.seleccionarPeriodo = seleccionarPeriodo;
		consultaFacturacionCtrl.consultaCatalogos = consultaCatalogos;
		
		activar();
		
		function activar(){
			consultaClientes();
		}
		
		function consultaClientes() {

            var promesa = FacturacionServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {
            	
            	if(respuesta.length > 0){
            		
            		consultaFacturacionCtrl.clientes = respuesta;
            		
            		if(consultaFacturacionCtrl.clientes.length == 1){
            			$log.info('consultaClientes');
            			consultaFacturacionCtrl.idClienteSeleccionado = consultaFacturacionCtrl.clientes[0].scltcod;
            			consultaFacturacionCtrl.bndSeleCliente = true;
            			consultaCarteraCli();
            			mostrarDetalleRegistro(true);
            		}
            	}else{
            		AdeaServicios.alerta("error", "No existen clientes para Facturar");
            	}
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los clientes para Facturación");
            })
        }
		
		function consultaCarteraCli(){
        	
			 $log.info('consultaCarteraCli');
	        	
			 var params = {
					 scltcod: consultaFacturacionCtrl.idClienteSeleccionado
			 };
	        	
			 var promesa = MantenimientoFacServicios.consultaCartera(params).$promise;

			 promesa.then(function (respuesta) {
				 consultaFacturacionCtrl.carteraCliente = respuesta;
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function consultaPeriodos(){

			 var filtro = _.filter(consultaFacturacionCtrl.carteraCliente, function (act) {
	                return act.idCarteraCliente === consultaFacturacionCtrl.idCarteraCliente;
	          });
			 
			 consultaFacturacionCtrl.tipoCartera = filtro[0].layoutFac;
			 
			 $log.info(consultaFacturacionCtrl.tipoCartera);
			 
			 var filtro = _.filter(consultaFacturacionCtrl.carteraCliente, function (act) {
        		 return act.idCarteraCliente == consultaFacturacionCtrl.idCarteraCliente;
        	 });
        	 
			 consultaFacturacionCtrl.carteraSeleccionada = filtro[0];
			 
			 if(consultaFacturacionCtrl.tipoCartera == 'A'){
				 consultaPeriodosArcGenerales();
			 }else{
				 consultaPeriodosGenerales();
			 }
		}

		function consultaPeriodosGenerales(){
        	
			 $log.info('consultaPeriodosGenerales');
			 
	        	
			 var params = {
					 idCarteraCliente: consultaFacturacionCtrl.idCarteraCliente,
					 tipoCartera: consultaFacturacionCtrl.tipoCartera
			 };
	        	
			 var promesa = FacturacionServicios.consultaPeriodosFacGral(params).$promise;

			 promesa.then(function (respuesta) {
				 consultaFacturacionCtrl.periodos = respuesta;
				 mostrarDetalleRegistro(true);
				 if(consultaFacturacionCtrl.periodos.length == 0){
					 AdeaServicios.alerta("error", "La cartera Seleccionada no cuenta con Periodos de Facturación generados");
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function consultaPeriodosArcGenerales(){
        	
			 $log.info('consultaPeriodosGenerales');
			 
			 var promesa = FacturacionServicios.consultaPeriodosArcGral().$promise;

			 promesa.then(function (respuesta) {
				 consultaFacturacionCtrl.periodos = respuesta;
				 mostrarDetalleRegistro(true);
				 if(consultaFacturacionCtrl.periodos.length == 0){
					 AdeaServicios.alerta("error", "La cartera Seleccionada no cuenta con Periodos de Facturación generados");
				 }
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al generar los periodos");
			 });
		 }
		
		function mostrarDetalleRegistro(valor) {
            $log.info("Entra al metodo mostrarDetalleRegistro() del Controlador");
            
            consultaFacturacionCtrl.mostrarDetallePer(valor);
        }
		
		function seleccionarPeriodo(reg){
			consultaFacturacionCtrl.periodoSeleccionado = reg;
			mostrarDetalleRegistro(false);
			consultaFacturacionCtrl.tituloDetalle = 'Período de Facturación '+ consultaFacturacionCtrl.periodoSeleccionado.periodo;
			
			if(consultaFacturacionCtrl.tipoCartera == 'A'){
				$log.info(consultaFacturacionCtrl.periodoSeleccionado);
				consultaGrpCatalogos(consultaFacturacionCtrl.periodoSeleccionado.idPeriodosFacturados);
				consultaFacturacionCtrl.parametrosProforma = {
	        			idCartera: consultaFacturacionCtrl.idCarteraCliente,
	        			pIdPeriodo: consultaFacturacionCtrl.periodoSeleccionado.idPeriodosFacturados
	        	};
			}else{
				consultaCatalogos(consultaFacturacionCtrl.periodoSeleccionado.idPeriodoFactGral, null);
				consultaFacturacionCtrl.parametrosProforma = {
	        			idCartera: consultaFacturacionCtrl.idCarteraCliente,
	        			pIdPeriodo: consultaFacturacionCtrl.periodoSeleccionado.idPeriodoFactGral
	        	};
			}
						
		}
		
		function regresar(){
			 consultaFacturacionCtrl.periodoSeleccionado = null;
			 consultaFacturacionCtrl.actividadEditable = null;
	        
		 }
		
		function consultaCatalogos(idPeriodoSeleccionado, grpSeleccionado){
        	$log.info('consultaCatalogos');

        	
        	var params = {
        			idCartera: consultaFacturacionCtrl.idCarteraCliente,
        			pIdPeriodo: idPeriodoSeleccionado,
        			pBBDD: grpSeleccionado
        	};
        	
            var promesa = FacturacionServicios.consultaConceptos(params).$promise;

            promesa.then(function (respuesta) {
            	consultaFacturacionCtrl.catalogoFac = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        }
		
		
		function consultaGrpCatalogos(idPeriodosFacturados){
        	$log.info('consultaGrpCatalogos');
        	
            var promesa = FacturacionServicios.consultaGrpConcepto().$promise;

            promesa.then(function (respuesta) {
            	consultaFacturacionCtrl.grpCatalogo = respuesta;
            	consultaFacturacionCtrl.grpSeleccionado = respuesta[0].key;
            	consultaCatalogos(idPeriodosFacturados, consultaFacturacionCtrl.grpSeleccionado);  		
            		
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
	}
})();