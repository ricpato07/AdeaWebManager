(function () {
    'use strict';

    angular
        .module('adeaModule')
        .controller('ReporteContratosController', ReporteContratosController);

    ReporteContratosController.$inject = ['$log', 'reporteService', 'tblSubProyectos', 'proyectoServicios', 'AdeaServicios', 'tblClientesCompletos', '$filter', '$timeout', 'DTColumnDefBuilder', 'tblClientesContratos', 'tblClientesCContratos', 'tblProyectosCContratos', 'tblProyectosCAnexo', 'tblProyectosCPoliza', 'tblDocumentosProyecto', 'tblContratosVigencias', 'tblClienteCProyecto', 'tblClienteSProyecto', 'tblProyectosDoc'];

    function ReporteContratosController($log, reporteService, tblSubProyectos, proyectoServicios, AdeaServicios, tblClientesCompletos, $filter, $timeout, DTColumnDefBuilder, tblClientesContratos, tblClientesCContratos, tblProyectosCContratos, tblProyectosCAnexo, tblProyectosCPoliza, tblDocumentosProyecto, tblContratosVigencias, tblClienteCProyecto, tblClienteSProyecto, tblProyectosDoc) {

        var reporteContratosCtrl = this;
        
        reporteContratosCtrl.labels = [];
        reporteContratosCtrl.data = [];
        
        reporteContratosCtrl.labelsProy = [];
        reporteContratosCtrl.dataProy = [];
        
        
        reporteContratosCtrl.tblClientesCompletos = tblClientesCompletos;
        reporteContratosCtrl.tblClientesContratos = tblClientesContratos;
        reporteContratosCtrl.tblClientesCContratos = tblClientesCContratos;
        reporteContratosCtrl.tblProyectosCContratos = tblProyectosCContratos;
        reporteContratosCtrl.tblProyectosCAnexo = tblProyectosCAnexo;
        reporteContratosCtrl.tblProyectosCPoliza = tblProyectosCPoliza;
        reporteContratosCtrl.tblDocumentosProyecto = tblDocumentosProyecto;
        reporteContratosCtrl.tblContratosVigencias= tblContratosVigencias;
        reporteContratosCtrl.tblClienteCProyecto = tblClienteCProyecto;
        reporteContratosCtrl.tblClienteSProyecto = tblClienteSProyecto;
        reporteContratosCtrl.tblProyectosDoc = tblProyectosDoc;
        reporteContratosCtrl.consultaClientesCompletos = consultaClientesCompletos;
        reporteContratosCtrl.consultaClientesInCompletos = consultaClientesInCompletos;
        reporteContratosCtrl.consultaClientesContrato = consultaClientesContrato;
        reporteContratosCtrl.consultaClientesSinContrato = consultaClientesSinContrato;
        reporteContratosCtrl.consultaProyectosCContrato = consultaProyectosCContrato;
        reporteContratosCtrl.consultaProyectosCAnexo = consultaProyectosCAnexo;
        reporteContratosCtrl.consultaProyectosCPoliza = consultaProyectosCPoliza;
        reporteContratosCtrl.consultaProyectosSDoc = consultaProyectosSDoc;
        reporteContratosCtrl.consultaContratoVigenciaProy = consultaContratoVigenciaProy;
        reporteContratosCtrl.onClickGrafico = onClickGrafico;
        reporteContratosCtrl.onClickGraficoProy = onClickGraficoProy;
        reporteContratosCtrl.consultaClientesCProyecto = consultaClientesCProyecto;
        reporteContratosCtrl.consultaClientesSProyecto = consultaClientesSProyecto;
        reporteContratosCtrl.seleccionarCliente = seleccionarCliente;
        
        
        reporteContratosCtrl.bndCliComp = false;
        reporteContratosCtrl.bndCliInComp = false;
        reporteContratosCtrl.bndCliInCont = false;
        reporteContratosCtrl.bndCliSinCont = false;
        reporteContratosCtrl.bndProyConCont = false;
        reporteContratosCtrl.bndProyConAnexo = false;
        reporteContratosCtrl.bndProyConPoliza = false;
        reporteContratosCtrl.bndProySDoc = false;
        reporteContratosCtrl.bndContratoVig = false;
        reporteContratosCtrl.bndCliCProy = false;
        reporteContratosCtrl.bndCliSProy = false;
        reporteContratosCtrl.bndContratoVigCli = false;
        reporteContratosCtrl.totalContratos = 0;
        reporteContratosCtrl.totalContratosProy = 0;

        activar();

        function activar() {
            $log.info('Activa el controlador ReporteContratosController');
            
            consultaIndicadores();
            
        }

        function consultaIndicadores(){
            $log.info('consulta Indicadores');

            var promesa = proyectoServicios.getIndicadoresRep().$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.indicadores = respuesta;
            	
            	angular.forEach(reporteContratosCtrl.indicadores.indVigentes, function (ind) {
               	 reporteContratosCtrl.data.push(ind.total);
               	 reporteContratosCtrl.labels.push(ind.etiqueta);
               	 
               	 reporteContratosCtrl.totalContratos = reporteContratosCtrl.totalContratos + ind.total;
                });
            	
            	angular.forEach(reporteContratosCtrl.indicadores.indVigentesProy, function (ind) {
                  	 reporteContratosCtrl.dataProy.push(ind.total);
                  	 reporteContratosCtrl.labelsProy.push(ind.etiqueta);
                  	 
                  	 reporteContratosCtrl.totalContratosProy = reporteContratosCtrl.totalContratosProy + ind.total;
                   });
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
        function consultaClientesCompletos(){
            $log.info('consulta clientes Completos');
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliComp = true;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;
            
            
            var params = {pInd: 'C'}

            var promesa = proyectoServicios.consultaClientesCompletos(params).$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesCompletos = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaClientesInCompletos(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = true;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;
            
            var params = {pInd: 'I'}

            var promesa = proyectoServicios.consultaClientesCompletos(params).$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesInCompletos = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaClientesContrato(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = true;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;
            
            var params = {pIn: 'in'}

            var promesa = proyectoServicios.consultaClientesContrato(params).$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesCcontrato = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaClientesSinContrato(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = true;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;

            var promesa = proyectoServicios.consultaClientesSContrato().$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesScontrato = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaProyectosCContrato(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.proyectosCcontrato = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = true;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;

            var promesa = proyectoServicios.consultaProyectosCContrato().$promise;
            
            promesa.then(function (respuesta) {
            	//reporteContratosCtrl.proyectosCcontrato = respuesta;
            	
            	angular.forEach(respuesta, function (ind) {
            		var contrato = {};
            		contrato.acltrzsc = ind.acltrzsc;
            		contrato.nombreProyecto = ind.nombreProyecto;
            		contrato.numContrato = ind.dato.numContrato;
            		contrato.fecContrato = ind.dato.fecContrato;
            		contrato.fecVencimiento = ind.dato.fecVencimiento;
            		contrato.tiempoVig = ind.dato.tiempoVig;
            		contrato.renovacion = ind.dato.renovacion;
            		contrato.copia = ind.dato.copia;
            		contrato.montoContrato = ind.dato.montoContrato;
            		
            		reporteContratosCtrl.proyectosCcontrato.push(contrato);
            	});
            	
            	
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaProyectosCAnexo(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.proyectosCanexo = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = true;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;

            var promesa = proyectoServicios.consultaProyectosCAnexo().$promise;
            
            promesa.then(function (respuesta) {
            	//reporteContratosCtrl.proyectosCcontrato = respuesta;
            	
            	angular.forEach(respuesta, function (ind) {
            		var contrato = {};
            		contrato.acltrzsc = ind.acltrzsc;
            		contrato.nombreProyecto = ind.nombreProyecto;
            		contrato.nombre = ind.dato.nombre;
            		contrato.fecVencimiento = ind.dato.fecVencimiento;
            		contrato.nomenclatura = ind.dato.nomenclatura;
            		            		
            		reporteContratosCtrl.proyectosCanexo.push(contrato);
            	});
            	
            	
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaProyectosCPoliza(){
            $log.info('consulta clientes InCompletos');
            
            reporteContratosCtrl.proyectosCpoliza = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = true;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;

            var promesa = proyectoServicios.consultaProyectosCPoliza().$promise;
            
            promesa.then(function (respuesta) {
            	//reporteContratosCtrl.proyectosCcontrato = respuesta;
            	
            	angular.forEach(respuesta, function (ind) {
            		var contrato = {};
            		contrato.acltrzsc = ind.acltrzsc;
            		contrato.nombreProyecto = ind.nombreProyecto;
            		contrato.tipoPoliza = ind.dato.tipoPoliza;
            		contrato.nombre = ind.dato.nombre;
            		contrato.fechaVencimiento = ind.dato.fechaVencimiento;
            		            		
            		reporteContratosCtrl.proyectosCpoliza.push(contrato);
            	});
            	
            	
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
        function consultaProyectosSDoc(metodo){
            $log.info('consulta clientes InCompletos');
            
            $log.info(metodo);
            
            reporteContratosCtrl.proyectosCdocumento = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = true;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;

            if(metodo == 'C'){
            	var promesa = proyectoServicios.consultaProyectosSContrato().$promise;
            	reporteContratosCtrl.listaDocs = 'Contrato';
            	reporteContratosCtrl.color = '#54518a';
            }else if(metodo == 'A'){
            	var promesa = proyectoServicios.consultaProyectosSAnexo().$promise;
            	reporteContratosCtrl.listaDocs = 'Anexo';
            	reporteContratosCtrl.color = '#c3821b';
            }else if(metodo == 'P'){
            	var promesa = proyectoServicios.consultaProyectosSPoliza().$promise;
            	reporteContratosCtrl.listaDocs = 'Poliza';
            	reporteContratosCtrl.color = '#b62b5e';
            }
            
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.proyectosCdocumento = respuesta;
            	           	
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
        function consultaContratoVigenciaProy(etiq){
            $log.info('consulta clientes InCompletos');
              
            reporteContratosCtrl.contratoVigencia = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = true;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;
            
            var params = {};
            $log.info("Etiquetaaas");
            $log.info(etiq);
            
            if(etiq == 'Vigentes'){
                params = {pSigno: '>'}
                reporteContratosCtrl.lblContratos = 'Vigentes'
            }else{
            	params = {pSigno: '<'}
            	reporteContratosCtrl.lblContratos = 'Vencidos'
            }
            
            var promesa = proyectoServicios.consultaContratosVigentes(params).$promise;
           
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.contratoVigencia = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function consultaContratoVigencia(etiq){
            $log.info('consulta clientes InCompletos');
              
            reporteContratosCtrl.contratoVigenciaCli = [];
            
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = true;
            
            var params = {};
            $log.info("Etiquetaaas");
            $log.info(etiq);
            
            if(etiq == 'Vigentes'){
                params = {pSigno: '>'}
                reporteContratosCtrl.lblContratos = 'Vigentes'
            }else{
            	params = {pSigno: '<'}
            	reporteContratosCtrl.lblContratos = 'Vencidos'
            }
            
            var promesa = reporteService.contratosVigentesCliente(params).$promise;
           
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.contratoVigenciaCli = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
        function onClickGrafico(points, evt){
        	 console.log(points[0]._model.label);
        	 
        	 if(points[0]._model.label == 'Vigentes'){
        		 consultaContratoVigencia('Vigentes');
        		 reporteContratosCtrl.colorContratos = '#7b7878'
        	 }else{
        		 consultaContratoVigencia('No');
        		 reporteContratosCtrl.colorContratos = '#f7464a'
        	 }
        }
        
        function onClickGraficoProy(points, evt){
       	 console.log(points[0]._model.label);
       	 
       	 if(points[0]._model.label == 'Vigentes'){
       		consultaContratoVigenciaProy('Vigentes');
       		 reporteContratosCtrl.colorContratos = '#7b7878'
       	 }else{
       		consultaContratoVigenciaProy('No');
       		 reporteContratosCtrl.colorContratos = '#f7464a'
       	 }
       }
        
        
        function consultaClientesCProyecto(){
            $log.info('consulta clientes Completos');
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = true;
            reporteContratosCtrl.bndCliSProy = false;
            reporteContratosCtrl.bndContratoVigCli = false;


            var promesa = reporteService.consultaCProyecto().$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesCProyectos = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
        function consultaClientesSProyecto(){
            $log.info('consulta clientes Completos');
            reporteContratosCtrl.bndCliInComp = false;
            reporteContratosCtrl.bndCliComp = false;
            reporteContratosCtrl.bndCliInCont = false;
            reporteContratosCtrl.bndCliSinCont = false;
            reporteContratosCtrl.bndProyConCont = false;
            reporteContratosCtrl.bndProyConAnexo = false;
            reporteContratosCtrl.bndProyConPoliza = false;
            reporteContratosCtrl.bndProySDoc = false;
            reporteContratosCtrl.bndContratoVig = false;
            reporteContratosCtrl.bndCliCProy = false;
            reporteContratosCtrl.bndCliSProy = true;
            reporteContratosCtrl.bndContratoVigCli = false;

            var promesa = reporteService.consultaSProyecto().$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.clientesSProyectos = respuesta;
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        function seleccionarCliente(cliente){
            $log.info('consulta clientes Completos');
            
            var param = {
            	pIdCliente: cliente.idClienteDetalle	
            };

            var promesa = reporteService.consultaDocProyecto(param).$promise;
            
            promesa.then(function (respuesta) {
            	reporteContratosCtrl.proyectoDoc = respuesta;
            	angular.element('#proyectosCli').modal('show');
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta los indicadores");
            });
        }
        
        
    }
})();