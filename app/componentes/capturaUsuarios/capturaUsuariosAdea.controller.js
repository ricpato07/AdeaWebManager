(function() {
	'use strict';

	angular.module('adeaModule').controller('CapturaUsuariosController',
			CapturaUsuariosController);

	CapturaUsuariosController.$inject = [ '$scope', '$log',
		 '$timeout', 'AdeaServicios', '$window', 'CapturaServicios', 'proyectoServicios' ];

	function CapturaUsuariosController($scope, $log, $timeout, AdeaServicios, $window, CapturaServicios, proyectoServicios) {
		
		var capturaUsuariosCtrl = this;
		
		capturaUsuariosCtrl.limpiarFormulario = limpiarFormulario;
		capturaUsuariosCtrl.cambiaTipoUsuario = cambiaTipoUsuario;
		capturaUsuariosCtrl.validaUsuario = validaUsuario;
		capturaUsuariosCtrl.agregarUsuario = agregarUsuario;
		capturaUsuariosCtrl.eliminarUsuario = eliminarUsuario;
		capturaUsuariosCtrl.validaUsuarioInterno = validaUsuarioInterno;
		capturaUsuariosCtrl.agregarUsuarioInterno = agregarUsuarioInterno;
		capturaUsuariosCtrl.validaUsuarioGuardar = validaUsuarioGuardar;
		capturaUsuariosCtrl.seleccionaInternet = seleccionaInternet;
		capturaUsuariosCtrl.seleccionaTarjeta = seleccionaTarjeta;
		capturaUsuariosCtrl.seleccionaFirma = seleccionaFirma;
		capturaUsuariosCtrl.seleccionaSinUsuario = seleccionaSinUsuario;
		capturaUsuariosCtrl.cambiaTipoUsuarioDeta = cambiaTipoUsuarioDeta;
		capturaUsuariosCtrl.seleccionaSinUsuarioChange = seleccionaSinUsuarioChange;
		capturaUsuariosCtrl.cambiaTipoMovimiento = cambiaTipoMovimiento;
		capturaUsuariosCtrl.validaAutorizacion = validaAutorizacion;
		
		capturaUsuariosCtrl.operatoriaCfg = {};
		capturaUsuariosCtrl.operatoriaCfg.scltcod = 2;
		capturaUsuariosCtrl.operatoriaCfg.idOperatoria = 962;
	    capturaUsuariosCtrl.operatoriaCfg.ssccod = 1
		capturaUsuariosCtrl.operatoriaCfg.capValidarOperatoriaS = false;
	    capturaUsuariosCtrl.operatoriaCfg.capValidarIngresoS = false;
	    capturaUsuariosCtrl.operatoriaCfg.capValidarCapturaS = false;
		capturaUsuariosCtrl.operatoriaCfg.capValidarIngresoU = false;
		capturaUsuariosCtrl.operatoriaCfg.capValidarCapturaU = true;
		capturaUsuariosCtrl.operatoriaCfg.capValidarOperatoriaU = false;
		capturaUsuariosCtrl.docCodI = 15;
		capturaUsuariosCtrl.docCodE = 16;
		
		capturaUsuariosCtrl.validDirectiva = false;
		capturaUsuariosCtrl.form = null;
		capturaUsuariosCtrl.usuario = {};
		capturaUsuariosCtrl.valOp = false;
		capturaUsuariosCtrl.captura = {};
		capturaUsuariosCtrl.captura.usuarios = [];
		capturaUsuariosCtrl.captura.fechaSolicitud = '';
		capturaUsuariosCtrl.captura.sinUsuario = 'N';
		capturaUsuariosCtrl.bndUsuarios = true;
		capturaUsuariosCtrl.bndModo = 'A';
		capturaUsuariosCtrl.bndTipoUsuario = true;
		capturaUsuariosCtrl.autorizacion = false;
		
		activar();

		
		function activar(){
			
			if(capturaUsuariosCtrl.captura.usuarios.length > 0){
				capturaUsuariosCtrl.valOp = true;
			}
			
			consultaCatGral('CAT_TIPO_USR_CAP');
			
			consultaCatGral('CAT_TIPO_MOV_CAP');
			consultaCatGral('CAT_TIPO_PERFIL_CAP');
			consultaCatGral('CAT_SINO_CAP');
			consultaCatGral('CAT_TIENE_FIRMA_CAP');
			consultaCatGral('CAT_USUARIO_CAP');
			consultaCatGral('CAT_TIPO_USR_I_CAP');
			consultaClientes();
			consultaCatGral('CAT_PERFIL_CAP_EX');
			capturaUsuariosCtrl.bndUsuarios = true;
			// consultaAplicaciones();
		}
		

		function consultaCatGral(catalogo){
        	
			 $log.info('consultaCarteraCli');
			 var params = {
					 grpCat: catalogo
			 };
	        	
			 var promesa = AdeaServicios.consultaCatalogoGral(params).$promise;

			 promesa.then(function (respuesta) {
				if(catalogo == 'CAT_TIPO_USR_CAP'){
					capturaUsuariosCtrl.tipoUsuario = respuesta;
				}
				if(catalogo == 'CAT_TIPO_MOV_CAP'){
					capturaUsuariosCtrl.tipoMov = respuesta;			
				}
				if(catalogo == 'CAT_TIPO_PERFIL_CAP'){
					capturaUsuariosCtrl.tipoPerfil = respuesta;
				}
				if(catalogo == 'CAT_USUARIO_CAP'){
					capturaUsuariosCtrl.usuarioCap = respuesta;
				}
				if(catalogo == 'CAT_SINO_CAP'){
					capturaUsuariosCtrl.sinoCap = respuesta;
				}
				if(catalogo == 'CAT_TIENE_FIRMA_CAP'){
					capturaUsuariosCtrl.tieneFirma = respuesta;
				}
				if(catalogo == 'CAT_PERFIL_CAP_EX'){
					capturaUsuariosCtrl.tipoPerfilEx = respuesta;
				}
				if(catalogo == 'CAT_TIPO_USR_I_CAP'){
					capturaUsuariosCtrl.tipoUsuarioCat = respuesta;
				}
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta los Catalogos");
			 });
		 }
		
		function limpiarFormulario(){
			$log.info('limpiarFormulario');
			capturaUsuariosCtrl.captura.tipoUsuarioValue = null;
			capturaUsuariosCtrl.captura = {};
			capturaUsuariosCtrl.captura.usuarios = [];
			capturaUsuariosCtrl.captura.sinUsuario = 'N';
			capturaUsuariosCtrl.usuario = {};
			capturaUsuariosCtrl.autorizacion = false;
		}
		
		function cambiaTipoUsuario(){
			$log.info('-----------cambiaTipoUsuario-----------');
			
			var value = angular.copy(capturaUsuariosCtrl.captura.tipoUsuarioValue);
			
			if(capturaUsuariosCtrl.captura.tipoUsuarioValue == 'I'){
				capturaUsuariosCtrl.operatoriaCfg.doccodU = capturaUsuariosCtrl.docCodI;
				$timeout(function(){
					var tipoMov = $window.document.getElementById('tipoMov');
				    tipoMov.focus();
        	    }, 700);
				
			}else{
				capturaUsuariosCtrl.operatoriaCfg.doccodU = capturaUsuariosCtrl.docCodE;
				capturaUsuariosCtrl.usuario.tieneTarjeta = 'N';
				capturaUsuariosCtrl.usuario.existeFirma = 'N';
				
				$timeout(function(){
					var cliente = $window.document.getElementById('cliente');
					cliente.focus();
				}, 700);
			}
			
			capturaUsuariosCtrl.captura = {};
			capturaUsuariosCtrl.captura.sinUsuario = 'N';
			capturaUsuariosCtrl.captura.tipoUsuarioValue = value;
			capturaUsuariosCtrl.usuario = {};
			capturaUsuariosCtrl.captura.usuarios = [];
		}
		
		
		function consultaAplicaciones(){
        	
			 $log.info('consultaAplicaciones');

	        	
			 var promesa = CapturaServicios.consultaAplicaciones().$promise;

			 promesa.then(function (respuesta) {
				 capturaUsuariosCtrl.aplicaciones = respuesta;
			 });
	            
			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta los Catalogos");
			 });
		 }
		
		function validaUsuario(){
			
			var bndVal = true;
			
			if(capturaUsuariosCtrl.usuario.tipoMovimiento == null || capturaUsuariosCtrl.usuario.tipoMovimiento == undefined || capturaUsuariosCtrl.usuario.tipoMovimiento == ''){
				bndVal = false;
			}
			if(capturaUsuariosCtrl.usuario.nombre == null || capturaUsuariosCtrl.usuario.nombre == undefined || capturaUsuariosCtrl.usuario.nombre == ''){
				bndVal = false;
			}
			if(capturaUsuariosCtrl.usuario.tipoPerfil == null || capturaUsuariosCtrl.usuario.tipoPerfil == undefined || capturaUsuariosCtrl.usuario.tipoPerfil == ''){
				bndVal = false;
			}
			return bndVal;
		}
		
		function validaUsuarioInterno(){
			
			var bndVal = true;
			
			if(!capturaUsuariosCtrl.captura.tipoMovimiento == 'M' && (capturaUsuariosCtrl.usuario.idUsuario == null || capturaUsuariosCtrl.usuario.idUsuario == undefined || capturaUsuariosCtrl.usuario.idUsuario == '')){
				bndVal = false;
			}
			
			if(capturaUsuariosCtrl.usuario.tipoUsuario == null || capturaUsuariosCtrl.usuario.tipoUsuario == undefined || capturaUsuariosCtrl.usuario.tipoUsuario == ''){
				bndVal = false;
			}else{
				if(capturaUsuariosCtrl.usuario.tipoUsuario == 'A'){
					if(capturaUsuariosCtrl.usuario.usuarioAplicativo == null || capturaUsuariosCtrl.usuario.usuarioAplicativo == undefined || capturaUsuariosCtrl.usuario.usuarioAplicativo == ''){
						bndVal = false;
					}
				}
			}
			
			
			
			
			return bndVal;
		}
		
		function agregarUsuario(){
			capturaUsuariosCtrl.bndUsuarios = false;
			capturaUsuariosCtrl.captura.usuarios.push(capturaUsuariosCtrl.usuario);
			capturaUsuariosCtrl.usuario = {};
			capturaUsuariosCtrl.usuario.tieneTarjeta = 'N';
			capturaUsuariosCtrl.usuario.existeFirma = 'N';
			
			$timeout(function(){
				capturaUsuariosCtrl.bndUsuarios = true;
				$timeout(function(){
					$window.document.getElementById('tipoMov').focus();
				});				
    	    });
		}
		
		function eliminarUsuario(index){
			capturaUsuariosCtrl.captura.usuarios.splice(index, 1);
			if(capturaUsuariosCtrl.captura.tipoUsuarioValue == 'I'){
				$window.document.getElementById('tipoUsu').focus();
			}else{
				$window.document.getElementById('tipoMov').focus();
			}
		}
		
		
		function consultaClientes() {
			 $log.info('consultaClientes');
        	var params = {estatus: null};
        	
            var promesa = proyectoServicios.consultaClientesGeneral(params).$promise;

            promesa.then(function (respuesta) {

            	capturaUsuariosCtrl.clientes = respuesta;

                if (capturaUsuariosCtrl.clientes.length == 0) {
                    AdeaServicios.alerta("error", "No existen clientes registrados");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta clientes: " + error.data);
            })


        }
		
		function agregarUsuarioInterno(){
			capturaUsuariosCtrl.bndUsuarios = false;
			capturaUsuariosCtrl.captura.usuarios.push(capturaUsuariosCtrl.usuario);
			capturaUsuariosCtrl.usuario = {};

			$timeout(function(){
				capturaUsuariosCtrl.bndUsuarios = true;
				$timeout(function(){
					var tipoMov = $window.document.getElementById('tipoUsu');
				    tipoMov.focus();
				});				
    	    }, 500);
		}
		
		function validaUsuarioGuardar(){
			$log.info('validaUsuarioGuardar');
			
			if(capturaUsuariosCtrl.captura.tipoUsuarioValue == 'I'){
								
				if(capturaUsuariosCtrl.captura.tipoMovimiento == 'A' && capturaUsuariosCtrl.captura.sinUsuario == 'S'){

					capturaUsuariosCtrl.autorizacion = true;
				}
				
				if((capturaUsuariosCtrl.captura.tipoMovimiento != 'M'  || capturaUsuariosCtrl.captura.tipoMovimiento != 'A') && capturaUsuariosCtrl.captura.usuarios.length > 0){
		            return true;
				}else if((capturaUsuariosCtrl.captura.tipoMovimiento == 'M' || capturaUsuariosCtrl.captura.tipoMovimiento == 'A') && capturaUsuariosCtrl.captura.sinUsuario == 'S' && capturaUsuariosCtrl.captura.usuarios.length == 0){
					return true;
				}else if((capturaUsuariosCtrl.captura.tipoMovimiento == 'M' || capturaUsuariosCtrl.captura.tipoMovimiento == 'A') && capturaUsuariosCtrl.captura.sinUsuario == 'N' && capturaUsuariosCtrl.captura.usuarios.length > 0){
					return true;
				}


			}else{
				if(capturaUsuariosCtrl.captura.usuarios.length > 0){
					return true;
				}
			}

			return false;
			
		}
		
		function seleccionaInternet(){
			 $log.info('seleccionaInternet');
			 
			 $log.info(capturaUsuariosCtrl.captura.internet);
			if(capturaUsuariosCtrl.captura.internet == 'N' || capturaUsuariosCtrl.captura.internet == undefined){
				capturaUsuariosCtrl.captura.internet = 'S';
			}else{
				capturaUsuariosCtrl.captura.internet = 'N';
			}
		}
		
		function seleccionaFirma(){
			 $log.info('seleccionaFirma');
			 
			 $log.info(capturaUsuariosCtrl.usuario.existeFirma);
			if(capturaUsuariosCtrl.usuario.existeFirma == 'N' || capturaUsuariosCtrl.usuario.existeFirma == undefined){
				capturaUsuariosCtrl.usuario.existeFirma = 'S';
			}else{
				capturaUsuariosCtrl.usuario.existeFirma = 'N';
			}
		}
		
		function seleccionaTarjeta(){
			$log.info('seleccionaTarjeta');
			 
			$log.info(capturaUsuariosCtrl.usuario.tieneTarjeta);
			if(capturaUsuariosCtrl.usuario.tieneTarjeta == 'N' || capturaUsuariosCtrl.usuario.tieneTarjeta == undefined){
				capturaUsuariosCtrl.usuario.tieneTarjeta = 'S';
			}else{
				capturaUsuariosCtrl.usuario.tieneTarjeta = 'N';
			}
		}
		
		function seleccionaSinUsuario(){
			 $log.info('seleccionaSinUsuario');
			 
			 $log.info(capturaUsuariosCtrl.captura.sinUsuario);
			if(capturaUsuariosCtrl.captura.sinUsuario == 'N' || capturaUsuariosCtrl.captura.sinUsuario == undefined){
				capturaUsuariosCtrl.captura.sinUsuario = 'S';
				capturaUsuariosCtrl.captura.usuarios = [];
				capturaUsuariosCtrl.autorizacion = true;
			}else{
				capturaUsuariosCtrl.captura.sinUsuario = 'N';
				capturaUsuariosCtrl.autorizacion = false;
			}
		}
		
		function seleccionaSinUsuarioChange(){
			 $log.info('seleccionaSinUsuario');
			 
			if(capturaUsuariosCtrl.captura.sinUsuario == 'S'){
				capturaUsuariosCtrl.captura.usuarios = [];
				capturaUsuariosCtrl.autorizacion = true;
			}else{
				capturaUsuariosCtrl.autorizacion = false;
			}
		}
		
		function cambiaTipoUsuarioDeta(){
			capturaUsuariosCtrl.bndTipoUsuario = false;
			capturaUsuariosCtrl.usuario.usuarioAplicativo = null;
			capturaUsuariosCtrl.usuario.correo = null;
			capturaUsuariosCtrl.usuario.idUsuario = null;
			capturaUsuariosCtrl.captura.sinUsuario = 'N';
			$timeout(function(){
				capturaUsuariosCtrl.bndTipoUsuario = true;
			});	
			
		}
		
		function cambiaTipoMovimiento(){
			if(capturaUsuariosCtrl.captura.tipoMovimiento != 'M' && capturaUsuariosCtrl.captura.sinUsuario == 'S'){
				capturaUsuariosCtrl.captura.sinUsuario = 'N';
			}
		}
		
		function validaAutorizacion(){
			capturaUsuariosCtrl.valAutorizacion(capturaUsuariosCtrl.idAutorizacion);
			capturaUsuariosCtrl.idAutorizacion = null;
		}
	}
})();