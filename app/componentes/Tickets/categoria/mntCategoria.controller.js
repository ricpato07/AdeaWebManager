(function() {
	'use strict';

	angular.module('adeaModule').controller('MntCategoriaController',
			MntCategoriaController);

	MntCategoriaController.$inject = [ '$log', 'proyectoServicios', 'AdeaServicios',
			'tblListaCategorias', 'ticketServicios', 'serviceUrl' ];

	function MntCategoriaController($log, proyectoServicios,
			AdeaServicios, tblListaCategorias, ticketServicios, serviceUrl) {

		var mntCategoriaCtrl = this;
		
		mntCategoriaCtrl.tblListaCategorias = tblListaCategorias;
		
		mntCategoriaCtrl.limpiaValores = limpiaValores;
		mntCategoriaCtrl.consultaCategorias = consultaCategorias;
		mntCategoriaCtrl.agregarCategoria = agregarCategoria;
		mntCategoriaCtrl.editarCategoria = editarCategoria;
		
		mntCategoriaCtrl.consultaPlantilla = consultaPlantilla;
		mntCategoriaCtrl.seleccionarCat = seleccionarCat;
		mntCategoriaCtrl.labelsMultiselect = {
	        	    "itemsSelected": "Gerentes Seleccionados",
	        	    "selectAll": "Seleccionar Todos",
	        	    "unselectAll": "Borrar Todos",
	        	    "search": "Buscar",
	        	    "select": "Seleccione"
	        	}
		
		activar()
		
		function activar(){
			$log.info('activar');
			consultaAreasAwm();
			
		}
		
		
		function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
            	mntCategoriaCtrl.areasAWM = respuesta;

                if (mntCategoriaCtrl.areasAWM.length == 0) {
                    AdeaServicios.alerta("error", "No existen areas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })
		}
		
		function consultaCategorias() {
			 
			if(mntCategoriaCtrl.idArea != null && mntCategoriaCtrl.idArea != '' && mntCategoriaCtrl.idArea != undefined){
			
				 var params = {
						 idArea: mntCategoriaCtrl.idArea
				 };
	
		            var promesa = ticketServicios.consultaCategorias(params).$promise;
	
		            promesa.then(function (respuesta) {
		            	mntCategoriaCtrl.listCategorias = respuesta;
		            });
	
		            promesa.catch(function (error) {
		                AdeaServicios.alerta("error", "Error al consulta las Categorias");
		            });
			}else{
				mntCategoriaCtrl.listCategorias= [];
				 AdeaServicios.alerta("error", "Seleccione un Área para consultar sus categorías");
			}
	     }

		function seleccionarCat(reg){
			mntCategoriaCtrl.catSeleccionado = reg;
			mntCategoriaCtrl.catEditable = angular.copy(mntCategoriaCtrl.catSeleccionado);
		}
		
		
		function limpiaValores(){
			mntCategoriaCtrl.catNueva = {};
			if(mntCategoriaCtrl.idArea != null && mntCategoriaCtrl.idArea != '' && mntCategoriaCtrl.idArea != undefined){
				mntCategoriaCtrl.catNueva.idArea = mntCategoriaCtrl.idArea;
				consultaPlantilla(mntCategoriaCtrl.catNueva.idArea);
			}
			
        }
		
		
		 function consultaPlantilla(idAreaRel) {
			 $log.info(idAreaRel);
			 var idArea = null;
			 
			 if(idAreaRel != null && idAreaRel != '' && idAreaRel != undefined){
				 idArea = idAreaRel;
			 }
			
			 var params = {pIdPerfil: '8, 9', estatus: 'A', idArea: idArea};
	           
			 var promesa = proyectoServicios.consultaPlantilla(params).$promise;
			 promesa.then(function (respuesta) {

				 mntCategoriaCtrl.listPlantillaGerente = respuesta;

				 if (mntCategoriaCtrl.listPlantillaGerente.length == 0) {
					 AdeaServicios.alerta("error", "No existen Recursos dentro de la Plantilla de Personal que tengan perfil de Gerente");
				 }
			 });

			 promesa.catch(function (error) {
				 AdeaServicios.alerta("error", "Error al consulta la Plantilla de Personal: " + error.data);
			 })
		 }
		 
		 function agregarCategoria(){
			 $log.info('agregarCategoria');
			 
			 angular.forEach(mntCategoriaCtrl.catNueva.gerentes, function (obj) {
				 delete obj.areaPlantilla;
				 delete obj.awmPlantillaCostos;
				 delete obj.costo;
				 delete obj.descPerfil;
				 delete obj.estatus;
				 delete obj.fechaAlta;
				 delete obj.fechaUltimaMod;
				 delete obj.login;
				 delete obj.nombre;
				 delete obj.perfil;
	          });

			
	           
			 var promesa = ticketServicios.agregarCategoria(mntCategoriaCtrl.catNueva).$promise;
			 promesa.then(function (respuesta) {
				 	 if(respuesta.error == 'ok'){
				 		AdeaServicios.alerta("success", "Se registro de manera satisfactoria la Categoría");
				 		consultaCategorias();
				 		angular.element('#agregarCategoria').modal('hide');
				 	 }else{
				 		 AdeaServicios.alerta("error", "Ocurrio un Error: " + respuesta.error);
				 	 }
			 });
			 
		 }
		 
		 function editarCategoria(){
			 $log.info('editarCategoria');
			 angular.forEach(mntCategoriaCtrl.catEditable.gerentes, function (obj) {
				 delete obj.areaPlantilla;
				 delete obj.awmPlantillaCostos;
				 delete obj.costo;
				 delete obj.descPerfil;
				 delete obj.estatus;
				 delete obj.fechaAlta;
				 delete obj.fechaUltimaMod;
				 delete obj.login;
				 delete obj.nombre;
				 delete obj.perfil;
	          });

			
	           
			 var promesa = ticketServicios.editarCategoria(mntCategoriaCtrl.catEditable).$promise;
			 promesa.then(function (respuesta) {
				 	 if(respuesta.idCategoria != null && respuesta.idCategoria != undefined && respuesta.idCategoria != ''){
				 		AdeaServicios.alerta("success", "Se actualizo de manera satisfactoria la Categoría");
				 		consultaCategorias();
				 		angular.element('#editarCategoria').modal('hide');
				 	 }else{
				 		 AdeaServicios.alerta("error", "Ocurrio un Error: " + respuesta.error);
				 	 }
			 });
			 
		 }
	}
})();