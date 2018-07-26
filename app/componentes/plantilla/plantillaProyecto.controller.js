(function () {
    'use strict';

    angular
        .module('adeaModule')
        .controller('PlantillaProyectoController', PlantillaProyectoController);

    PlantillaProyectoController.$inject = ['$log', 'tblPlantilla', 'proyectoServicios', 'AdeaServicios', '$timeout', 'tblCostosPlantilla'];

    function PlantillaProyectoController($log, tblPlantilla, proyectoServicios, AdeaServicios, $timeout, tblCostosPlantilla) {

        var plantillaProyectoCtrl = this;

        plantillaProyectoCtrl.tblPlantilla = tblPlantilla;
        plantillaProyectoCtrl.tblCostosPlantilla = tblCostosPlantilla;
        plantillaProyectoCtrl.agregarRecurso = agregarRecurso;
        plantillaProyectoCtrl.editarRecurso = editarRecurso;
        plantillaProyectoCtrl.recurso = null;
        plantillaProyectoCtrl.seleccionarPersona = seleccionarPersona;
        plantillaProyectoCtrl.noHaCambiadoRecurso = noHaCambiadoRecurso;
        plantillaProyectoCtrl.getSelectedItemsIncluding = getSelectedItemsIncluding;
        plantillaProyectoCtrl.onDragstart = onDragstart;
        plantillaProyectoCtrl.onMoved = onMoved;
        plantillaProyectoCtrl.consultaUsuariosMx = consultaUsuariosMx;
        plantillaProyectoCtrl.limpiaValores = limpiaValores;
        
        plantillaProyectoCtrl.labelsMultiselect = {
        	    "itemsSelected": "Areas Seleccionadas",
        	    "selectAll": "Seleccionar Todas",
        	    "unselectAll": "Borrar Todas",
        	    "search": "Buscar",
        	    "select": "Seleccione"
        	}

        activar();

        function activar() {
            consultaPlantilla(null);
            consultaPerfiles();
            consultaAreasAwm();
            consultaUsuariosMx();
        }


        function consultaPlantilla(pIdPlantilla) {

            var params = {pIdPlantilla: pIdPlantilla};

            var promesa = proyectoServicios.consultaPlantilla(params).$promise;

            promesa.then(function (respuesta) {
                if (pIdPlantilla == null) {
                    plantillaProyectoCtrl.listPlantilla = respuesta;
                } else {
                    var index = plantillaProyectoCtrl.listPlantilla.indexOf(plantillaProyectoCtrl.personaSeleccionado);
                    plantillaProyectoCtrl.listPlantilla[index] = respuesta[0];
                }

                if (plantillaProyectoCtrl.listPlantilla.length == 0) {
                    AdeaServicios.alerta("error", "No existen Recursos dentro de la Plantilla de Personal ");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta la Plantilla de Personal: " + error.data.error);
            })


        }

        function consultaPerfiles() {

            var params = {
                keyCatalogo: 'PUESTOS',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;

            promesa.then(function (respuesta) {

                plantillaProyectoCtrl.perfiles = respuesta;


                if (plantillaProyectoCtrl.perfiles.length == 0) {
                    AdeaServicios.alerta("error", "No existen Perfiles dentro del catalogo de perfiles");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el Catalogo de Perfiles: " + error.data.error);
            })


        }

        function agregarRecurso() {
            $log.info('agregarRecurso')

            plantillaProyectoCtrl.recurso.estatus = 'A';

            var promesa = proyectoServicios.insertarRecurso(plantillaProyectoCtrl.recurso).$promise;

            promesa.then(function (respuesta) {
                plantillaProyectoCtrl.recurso = respuesta;

                plantillaProyectoCtrl.listPlantilla.push(plantillaProyectoCtrl.recurso);
                angular.element('#agregarRecurso').modal('hide');
                plantillaProyectoCtrl.recurso = null;
                plantillaProyectoCtrl.personaSeleccionado = null;
                AdeaServicios.alerta("success", "Se registro el recurso de manera Satisfactoria");
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al insertar la Persona o ya existe un registro con el nombre" +
                    " capturado");
            })
        }

        function editarRecurso() {
            $log.info('agregarRecurso')

            var promesa = proyectoServicios.editarRecurso(plantillaProyectoCtrl.personaEditable).$promise;

            promesa.then(function (respuesta) {

                consultaPlantilla(plantillaProyectoCtrl.personaEditable.idPlantilla);

                angular.element('#editarRecurso').modal('hide');
                AdeaServicios.alerta("success", "Se modifico el recurso de manera Satisfactoria");
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al editar el recurso de la Plantilla de Personal: " + error.data.error);
            })
        }

        function seleccionarPersona(reg) {
            $log.info('seleccionarPersona');
            consultaAreaPlantilla(reg);
           
        }
        
        function consultaAreaPlantilla(reg){
        	
        	 var params = {
                     pIdPlantilla: reg.idPlantilla
                 };

                 var promesa = proyectoServicios.consultaAreaPlant(params).$promise;

                 promesa.then(function (respuesta) {
                     // plantillaProyectoCtrl.areasPlantilla = respuesta;
                	 plantillaProyectoCtrl.personaSeleccionado = reg;
                	 plantillaProyectoCtrl.personaSeleccionado.areaPlantilla = [];
                     plantillaProyectoCtrl.personaSeleccionado.areaPlantilla = respuesta;
                	 plantillaProyectoCtrl.personaEditable = angular.copy(plantillaProyectoCtrl.personaSeleccionado);
                	 consultaCostoPlantilla();

                     if (plantillaProyectoCtrl.personaSeleccionado.areaPlantilla.length == 0) {
                         AdeaServicios.alerta("error", "La persona no esta Asignado a un Area");
                     }
                 });

                 promesa.catch(function (error) {
                     AdeaServicios.alerta("error", "Error al consulta las Areas de la Persona seleccionada: " + error.data);
                 })
        }
        
        function consultaCostoPlantilla(){
        	
       	 	var params = {
                    pIdPlantilla: plantillaProyectoCtrl.personaSeleccionado.idPlantilla
                };

                var promesa = proyectoServicios.consultaCostoPlant(params).$promise;

                promesa.then(function (respuesta) {
                    plantillaProyectoCtrl.personaEditable.awmPlantillaCostos = respuesta;
                });

                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al consultar el Historial de Salario de la Persona seleccionada: " + error.data);
                })
       }

        function noHaCambiadoRecurso() {
            var bndCambio = false;

            if (!angular.equals(plantillaProyectoCtrl.personaSeleccionado, plantillaProyectoCtrl.personaEditable)) {
                bndCambio = true;
            }

            return bndCambio;
        }

        function consultaAreasAwm() {

            var params = {
                pIdArea: null
            };

            var promesa = proyectoServicios.consultaAreasAWM(params).$promise;

            promesa.then(function (respuesta) {
                plantillaProyectoCtrl.areasAWM = respuesta;
                
                angular.forEach(plantillaProyectoCtrl.areasAWM, function (obj) {
                	delete obj.fecRegistro;
                });

                if (plantillaProyectoCtrl.areasAWM.length == 0) {
                    AdeaServicios.alerta("error", "No existen areas registradas");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })

        }
        
        function consultaUsuariosMx() {
        	
        	$log.info('consultaUsuariosMx');


            var promesa = AdeaServicios.consultaUsuarioMx().$promise;

            promesa.then(function (respuesta) {
                plantillaProyectoCtrl.usersMx = respuesta;

                if (plantillaProyectoCtrl.usersMx.length == 0) {
                    AdeaServicios.alerta("error", "No existen usuario con la cadena Capturada");
                }
            });

            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las Areas de Adea: " + error.data);
            })


        }
        
        
        function getSelectedItemsIncluding(list, item) {
            item.selected = true;
            return list.items.filter(function(item) { return item.selected; });
        }
        
        function onDragstart(list, event) {
            list.dragging = true;
            if (event.dataTransfer.setDragImage) {
              var img = new Image();
              img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
              event.dataTransfer.setDragImage(img, 0, 0);
            }
         }
        
        function onMoved(list) {
            list.items = list.items.filter(function(item) { return !item.selected; });
        }
        
        function limpiaValores(){
        	plantillaProyectoCtrl.recurso = {};
        }
        
    }
})
();