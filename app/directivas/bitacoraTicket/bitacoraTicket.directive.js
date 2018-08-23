(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:editarTickets
     * @scope
     * @restrict E
     * @description Directiva que se encarga de la búsqueda del ticket
     */
    angular
            .module('adeaDirectivas')
            .controller('bitacoraTicketController', bitacoraTicketController)
            .directive('bitacoraTicket', bitacoraTicket);

    bitacoraTicket.$inject = ['$log'];
    bitacoraTicketController.$inject = ['$log', '$scope', '$timeout', 'AdeaServicios', 'ticketServicios', '$window', '$filter'];

    function bitacoraTicketController($log, $scope, $timeout, AdeaServicios, ticketServicios, $window, $filter) {

        var bitacoraTicketCtrl = this;
        bitacoraTicketCtrl.agregarArchivo = agregarArchivo;
        bitacoraTicketCtrl.descargarArchivo = descargarArchivo;
        bitacoraTicketCtrl.eliminarArchivo = eliminarArchivo;
        bitacoraTicketCtrl.guardarRelacion = guardarRelacion;
        bitacoraTicketCtrl.eliminarRelacion = eliminarRelacion;
        bitacoraTicketCtrl.cancelarNota = cancelarNota;
        bitacoraTicketCtrl.editarNota = editarNota;
        bitacoraTicketCtrl.eliminarNota = eliminarNota;
        bitacoraTicketCtrl.modificaNota = modificaNota;
        bitacoraTicketCtrl.noHaCambiadoNota = noHaCambiadoNota;
        bitacoraTicketCtrl.guardarNota = guardarNota;
        bitacoraTicketCtrl.idticket = $scope.idticket;
        bitacoraTicketCtrl.bEditar = true;
        bitacoraTicketCtrl.bndArchivos = true;
        bitacoraTicketCtrl.modoGuardar = true;
        
        buscarTicket(bitacoraTicketCtrl.idticket);

        function buscarTicket(idTicket) {
         
            if (idTicket == null || idTicket == '' || idTicket == undefined) {
                return null;
            }

            var params = {
                idTicket: idTicket
            };

            var promesa = ticketServicios.consultaTicket(params).$promise;

            promesa.then(function (respuesta) {
                if (respuesta.length > 0) {
//                    bitacoraTicketCtrl.miTicketSeleccionado = respuesta[0];
//                    bitacoraTicketCtrl.miTicketEditable = angular.copy(bitacoraTicketCtrl.miTicketSeleccionado);
                    bitacoraTicketCtrl.miTicketEditable = respuesta[0];
                    consultaArchivosTicket();
                    consultaCatRel();
                    consultaRelacionTicket();
                    consultaObservaciones();
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "El usuario no tiene tickets");
                }
            });
        }

        function agregarArchivo() {
            bitacoraTicketCtrl.bndArchivos = false;
            var formData = new FormData();

            formData.append('file', bitacoraTicketCtrl.archivo);
            formData.append('idTicket', bitacoraTicketCtrl.miTicketEditable.idTicket);

            var promesa = ticketServicios.registrarArchivo(formData).$promise;

            promesa.then(function (respuesta) {
                // consultar Archivos
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "El archivo se dio de Alta de manera satisfactoria");
                    consultaArchivosTicket();
                    consultaBitacora();
                    bitacoraTicketCtrl.archivo = null;
                    bitacoraTicketCtrl.bndArchivos = true;
                } else {
                    $log.info('error al guardar en la ruta');
                    AdeaServicios.alerta("error", respuesta.error);
                    bitacoraTicketCtrl.bndArchivos = true;
                    bitacoraTicketCtrl.archivo = null;
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al guardar Archivo: " + error.data);
            });
        }

        function descargarArchivo(archivo) {
            var param = {
                pcNombre: archivo.nombreArchivo,
                pcRuta: archivo.urlArchivo
            }
            var descarga = ticketServicios.descargarArchivoAdjuntos(param).$promise;
            descarga.then(function (dato) {
                $log.info(dato.response.blob.size);

                if (dato.response.blob.size > 0) {
                    var blob = dato.response.blob;
                    ($window).saveAs(blob, archivo.nombreArchivo);
                } else {
                    AdeaServicios.alerta("error", "Error al descargar el Archivo: el archivo no existe o esta dañado");
                }
            });
            descarga.catch(function (respuesta) {
                $log.error(respuesta)
            });
        }

        function eliminarArchivo(archivo) {
            var param = {
                pcIdArchivoTicket: archivo.idArchivoTicket,
                pcNombre: archivo.nombreArchivo,
                pcRuta: archivo.urlArchivo
            }
            var promesa = ticketServicios.eliminaAdjunto(param).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se archivo de borró de manera correcta");
                    consultaArchivosTicket();
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", respuesta.error);
                }
            });
            promesa.catch(function (respuesta) {
                $log.error(respuesta)
            });
        }

        function guardarRelacion() {
            $log.info('guardarRelacion');
            var relacion = {
                idTicketRel: bitacoraTicketCtrl.idTicketRel,
                codigoRelacion: bitacoraTicketCtrl.relacion,
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket
            };
            var promesa = ticketServicios.registraRelacionTicket(relacion).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se registró la relación de manera correcta");
                    consultaRelacionTicket();
                    bitacoraTicketCtrl.idTicketRel = null;
                    bitacoraTicketCtrl.relacion = null;
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al registrar la relación: " + error.data);
            });
        }

        function eliminarRelacion(idTicketRelacion) {
            var params = {
                idTicketRelacion: idTicketRelacion
            };
            var promesa = ticketServicios.eliminaTicketRelacion(params).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se eliminó de manera correcta la relación seleccionada");
                    consultaRelacionTicket();
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "Error al eliminar la relación del ticket: " + respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta las relaciones del ticket: " + error.data);
            });
        }

        function editarNota(notaSeleccionada) {
            $log.info('editarNota');
            $log.info(notaSeleccionada);
            bitacoraTicketCtrl.notaSeleccionada = angular.copy(notaSeleccionada);
            bitacoraTicketCtrl.nota = notaSeleccionada.observacion;
            bitacoraTicketCtrl.modoGuardar = false;
        }

        function noHaCambiadoNota() {
            var bndCambio = false;
            if (bitacoraTicketCtrl.notaSeleccionada.observacion != bitacoraTicketCtrl.nota) {
                bndCambio = true;
            }
            return bndCambio;
        }

        function modificaNota() {
            var param = {
                idObservacionesTicket: bitacoraTicketCtrl.notaSeleccionada.idObservacionesTicket,
                observacion: bitacoraTicketCtrl.nota
            }
            var promesa = ticketServicios.modificaNotaTicket(param).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se guardó correctamente la nota");
                    consultaObservaciones();
                    bitacoraTicketCtrl.nota = null;
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "Error al guardar la nota: " + respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al guardar la nota: " + error.data);
            });
        }

        function eliminarNota(idObservacionTicket) {
            var params = {
                idObservacionTicket: idObservacionTicket
            };
            var promesa = ticketServicios.eliminarNota(params).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se eliminó de manera correcta la nota seleccionada");
                    consultaObservaciones();
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "Error al eliminar la nota del ticket: " + respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al registrar la nota del ticket: " + error.data);
            });
        }
        
        function cancelarNota() {
            bitacoraTicketCtrl.nota = undefined;
            bitacoraTicketCtrl.modoGuardar = true;
        }

        function guardarNota() {
            var params = {
                observacion: bitacoraTicketCtrl.nota,
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket

            };
            var promesa = ticketServicios.guardarNotaTicket(params).$promise;
            promesa.then(function (respuesta) {
                if (respuesta.error == 'ok') {
                    AdeaServicios.alerta("success", "Se guardó correctamente la nota");
                    consultaObservaciones();
                    bitacoraTicketCtrl.nota = null;
                    consultaBitacora();
                } else {
                    AdeaServicios.alerta("error", "Error al guardar la nota: " + respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al guardar la nota: " + error.data);
            });
        }

        function consultaArchivosTicket() {
            var params = {
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket
            };
            var promesa = ticketServicios.consultaArchivosTicket(params).$promise;
            promesa.then(function (respuesta) {
                bitacoraTicketCtrl.listArchivosTicket = respuesta;
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consulta el archivo: " + error.data);
            });
        }

        function consultaCatRel() {
            var params = {
                keyCatalogo: 'TIPO_REL_TICKET',
                scltcod: 2,
                claveCat: null
            };

            var promesa = AdeaServicios.consultaCatalogo(params).$promise;
            promesa.then(function (respuesta) {
                bitacoraTicketCtrl.catRel = respuesta;
                if (bitacoraTicketCtrl.catRel.length == 0) {
                    AdeaServicios.alerta("error", "No existen opciones dentro del catálogo de relaciones");
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar el catálogo de relaciones: " + error.data);
            });
        }

        function consultaRelacionTicket() {
            var params = {
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket
            };
            var promesa = ticketServicios.consultaRelacionTicket(params).$promise;
            promesa.then(function (respuesta) {
                bitacoraTicketCtrl.listRelacionTicket = respuesta;
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar las relaciones del ticket: " + error.data);
            });
        }

        function consultaObservaciones() {
            var params = {
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket
            };
            var promesa = ticketServicios.consultaObservaciones(params).$promise;
            promesa.then(function (respuesta) {
                bitacoraTicketCtrl.listNotasTicket = respuesta;
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar las notas del ticket: " + error.data);
            });
        }

        function consultaBitacora() {
            var params = {
                idTicket: bitacoraTicketCtrl.miTicketEditable.idTicket
            };
            var promesa = ticketServicios.consultaLogTicket(params).$promise;
            promesa.then(function (respuesta) {
                bitacoraTicketCtrl.listLogTicket = respuesta;
                bitacoraTicketCtrl.listLogTicket = $filter('ordenarListMilisTickets')(bitacoraTicketCtrl.listLogTicket);
            });
            promesa.catch(function (error) {
                $log.info(error);
                AdeaServicios.alerta("error", "Error al consultar la bitácora del ticket: " + error.data);
            });
        }

        function bitacoraAction() {
            $log.info("bitacoraAction ----");
            $scope.bitacoraAction();
        }

    }


    function bitacoraTicket() {
        var directiva = {
            controller: bitacoraTicketController,
            restrict: 'E',
            controllerAs: 'bitacoraTicketCtrl',
            transclude: false,
            scope: {
                idticket: '=',
                bitacoraAction: '&?'
            },
            templateUrl: 'app/directivas/bitacoraTicket/bitacoraTicket.html'
        };
        return directiva;
    }

})();
