(function() {
	'use strict';

	angular.module('adeaModule').controller('FacturacionController',
			FacturacionController);

	FacturacionController.$inject = [ '$log', 'tblPlantilla',
			'proyectoServicios', 'FacturacionServicios', '$timeout',
			'tblCostosPlantilla', 'AdeaServicios', '$window', 'MantenimientoFacServicios'];

	function FacturacionController($log, tblPlantilla, proyectoServicios,
			FacturacionServicios, $timeout, tblCostosPlantilla, AdeaServicios, $window, MantenimientoFacServicios) {

		var facturacionCtrl = this;
		

		facturacionCtrl.consultaCarteraCli = consultaCarteraCli;
		facturacionCtrl.setDate = setDate;
		facturacionCtrl.cambioCartera = cambioCartera;
		facturacionCtrl.irProcesar = irProcesar;
		
		facturacionCtrl.bndGeneraFac = '';
		facturacionCtrl.bndSeleCliente = false;
		facturacionCtrl.bndGeneraPeriodos = true;
		facturacionCtrl.periodoExistente = null;
		facturacionCtrl.bndCargarArchivo = true;
		facturacionCtrl.bndHabilidaFecha = false;
		
		facturacionCtrl.fechaFin = {abierto: false};
		facturacionCtrl.fechaIni = {abierto: false};
		
		
		facturacionCtrl.abrirFechaIni = function () {
			facturacionCtrl.fechaIni.abierto = true;
        };

        facturacionCtrl.abrirFechaFin = function () {
        	facturacionCtrl.fechaFin.abierto = true;
        };

		activar();

		function activar() {
			consultaClientes();
		}
		
		function consultaClientes() {

            var promesa = FacturacionServicios.consultaClientes().$promise;

            promesa.then(function (respuesta) {
            	
            	if(respuesta.length > 0){
            		
            		facturacionCtrl.clientes = respuesta;
            		
            		if(facturacionCtrl.clientes.length == 1){
            			$log.info('consultaClientes');
            			facturacionCtrl.idClienteSeleccionado = facturacionCtrl.clientes[0].scltcod;
            			facturacionCtrl.bndSeleCliente = true;
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
		        
        
        function consultaCarteraCli(){
        	$log.info('consultaCarteraCli');
        	
        	var params = {
        			scltcod: facturacionCtrl.idClienteSeleccionado
        	};
        	
            var promesa = MantenimientoFacServicios.consultaCartera(params).$promise;

            promesa.then(function (respuesta) {
            		facturacionCtrl.carteraCliente = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al generar los periodos");
            });
        	
        }
        
        
        function setDate() {
			if (moment(facturacionCtrl.filtro.fecIni) > moment(facturacionCtrl.filtro.fecFin)) {
				facturacionCtrl.filtro.fecFin = null;
			}
		}
        
        function cambioCartera(){
        	$log.info('cambioCartera');
        	facturacionCtrl.layoutCartera = null;
        	facturacionCtrl.erroresFacGral = null;
        	
        	 var filtro = _.filter(facturacionCtrl.carteraCliente, function (act) {
        		 return act.idCarteraCliente == facturacionCtrl.idCarteraCliente;
        	 });
        	 
        	 facturacionCtrl.carteraSeleccionada = filtro[0];
        	
        	if(facturacionCtrl.carteraSeleccionada.periodoFac != 1){
        		facturacionCtrl.bndHabilidaFecha = true;
        	}
        }
        
        function irProcesar(){
        	$log.info('irProcesar');
        	facturacionCtrl.layoutCartera = null;
        	
        	$log.info(facturacionCtrl.layoutCartera);
        	 $timeout(function(){
	        	if((facturacionCtrl.carteraSeleccionada.idProceso != null && facturacionCtrl.carteraSeleccionada.idProceso != undefined) || facturacionCtrl.carteraSeleccionada.layoutFac == 'A'){
		        	
		        	if(facturacionCtrl.carteraSeleccionada.layoutFac == null && facturacionCtrl.carteraSeleccionada.layoutFac == undefined){
		        		 AdeaServicios.alerta("error", "La cartera Selecionada no tiene un Layout configurado, favor de Configurar un Layout para su procesamiento");
		        	}else if(facturacionCtrl.carteraSeleccionada.layoutFac == 'E'){
		        		facturacionCtrl.layoutCartera = 'E';
		        	}else if(facturacionCtrl.carteraSeleccionada.layoutFac == 'A'){
		        		facturacionCtrl.layoutCartera = 'AG';
		        		// inicializarFacAg();
		        	}
	        	}else{
	        		AdeaServicios.alerta("error", "La Cartera Seleccionada No tiene un Proceso configurado para Ejecutar, solicitar se configure un proceso.");
	        	}
        	 });
        }
        
        function inicializarFacAg(){
        	$log.info('inicializarFacAg');

        	consultaPeriodosValidos();
        }
        
	}
})();