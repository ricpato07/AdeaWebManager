(function() {
	"use strict";

	/**
	 * @ngdoc service
	 * @name mantenimientos.service:mantenimientosServicios
	 * @descripcion Definicion de los servicios de los mantenimientos dentro del
	 *              sistema
	 */
	angular.module('serviciosModulo').factory('MantenimientoFacServicios', AdeaServicios);

	AdeaServicios.$inject = [ '$resource', '$window', 'serviceUrl', 'toaster' ];

	function AdeaServicios($resource, $window, serviceUrl, toaster) {

		var consulta = $resource(serviceUrl + 'cartera/:servicio', {servicio : '@servicio'}, {
			cartera : { method : 'POST', headers : { 'Content-Type' : 'application/json'}, isArray : true,
				params:{
					scltcod: '@scltcod'
				}
			},
			consItem : { method : 'POST', headers : { 'Content-Type' : 'application/json'}, isArray : true
			}
		});
		
		var operacion = $resource(serviceUrl + 'cartera/:servicio', {servicio : '@servicio'}, {
			insertaCar : { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					carteraCliente: '@carteraCliente'
				}
			},
			editaCar : { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					cartera: '@cartera'
				}
			},
			inserItem : { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					item: '@item'
				}
			},
			editItem : { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					item: '@item'
				}
			},
			editConcepto: { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					concepto: '@concepto'
				}
			},
			inserConcepto: { method : 'POST', headers : { 'Content-Type' : 'application/json'},
				params:{
					concepto: '@concepto'
				}
			}
			
		});

		var serviciosAdea = {
			consultaCartera : consultaCartera,
			insertarCartera: insertarCartera,
			editarCartera: editarCartera,
			consultaItems: consultaItems, 
			insertaItems: insertaItems,
			editaItems: editaItems,
			editarConcepto: editarConcepto,
			insertaConcepto: insertaConcepto
		};

		return serviciosAdea;

		function consultaCartera(params){
			  return consulta.cartera({servicio: 'consultaCartera.action'}, params);
		}
		
		function insertarCartera(params){
			  return operacion.insertaCar({servicio: 'insertaCartera.action'}, params);
		}
		
		function editarCartera(params){
			  return operacion.editaCar({servicio: 'editarCartera.action'}, params);
		}
		
		function consultaItems(){
			  return consulta.consItem({servicio: 'consultaItems.action'});
		}
		
		function insertaItems(params){
			  return operacion.inserItem({servicio: 'insertaItem.action'}, params);
		}
		
		function editaItems(params){
			  return operacion.editItem({servicio: 'editarItem.action'}, params);
		}
		
		function editarConcepto(params){
			  return operacion.editConcepto({servicio: 'editarConcepto.action'}, params);
		}
		
		function insertaConcepto(params){
			  return operacion.inserConcepto({servicio: 'insertaConcepto.action'}, params);
		}
		
		
		
		
		
	}
})();
