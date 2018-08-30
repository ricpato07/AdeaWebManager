(function () {
    'use strict';

    angular.module('adeaModule').controller('TableroTicketsController', TableroTicketsController);

    TableroTicketsController.$inject = ['$log', '$timeout', 'AdeaServicios', 'tableroServicios', 'tblDetalleTickets', 'proyectoServicios'];

    function TableroTicketsController($log, $timeout, AdeaServicios, tableroServicios, tblDetalleTickets, proyectoServicios) {

        var tableroTicketsCtrl = this;
        tableroTicketsCtrl.init = init;
        tableroTicketsCtrl.consultaTotales = consultaTotales;
        tableroTicketsCtrl.consultaDetalle = consultaDetalle;
        tableroTicketsCtrl.tblDetalleTickets = tblDetalleTickets;
        tableroTicketsCtrl.seleccionarmiTicket = seleccionarmiTicket;
        tableroTicketsCtrl.buscarTicket = buscarTicket;
        tableroTicketsCtrl.mostrar_action = mostrar_action;
        tableroTicketsCtrl.areas_action = areas_action;
        tableroTicketsCtrl.categorias_action = categorias_action;
        tableroTicketsCtrl.regresar = regresar;
        tableroTicketsCtrl.busqueda_asignado_change = busqueda_asignado_change;
        tableroTicketsCtrl.quitar_usuario_asignado = quitar_usuario_asignado;
        tableroTicketsCtrl.user = {};
        tableroTicketsCtrl.bbusquedacorrecta = false;
        tableroTicketsCtrl.idticketbusqueda;
        tableroTicketsCtrl.btablero = true;
        tableroTicketsCtrl.status = undefined;
        init();

        /*
         * 
         Datos de prueba
         */
//        tableroTicketsCtrl.bbusqueda = true;
//        tableroTicketsCtrl.bbusquedacorrecta = true;
        /**/

        function init() {
            tableroTicketsCtrl.bareas = false;
            tableroTicketsCtrl.bcategorias = false;
            usuarioLogueado();
        }

        function usuarioLogueado() {
            var area_item = undefined;
            var promesa = tableroServicios.getUser().$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);
                tableroTicketsCtrl.usuario = respuesta.user;
                tableroTicketsCtrl.plantilla = respuesta.plantilla;
                $log.info(tableroTicketsCtrl.usuario.login);
                $log.info(tableroTicketsCtrl.plantilla.perfil);
                tableroTicketsCtrl.user.usuario = tableroTicketsCtrl.usuario.login;
                tableroTicketsCtrl.user.perfil = tableroTicketsCtrl.plantilla.perfil;


                tableroTicketsCtrl.bbusqueda = false;
                //caso para gerente - carga combos

                tableroTicketsCtrl.bbusqueda = true;
                var params = {
                    user: tableroTicketsCtrl.user.usuario
                };
                var promesa2 = tableroServicios.getAreasByUser(params).$promise;

                promesa2.then(function (respuesta2) {
                    $log.info("areas");
                    $log.info(respuesta2);
                    tableroTicketsCtrl.areaslist = respuesta2;
                    if (respuesta2 != undefined && respuesta2 != null) {
                        area_item = respuesta2[0];
                        mostrar_buscador(area_item);
                    }
                });

                promesa2.catch(function (error2) {
                    $log.error(error2);
                    mostrar_buscador(area_item);
                });

            });

            promesa.catch(function (error) {
                $log.error(error);
            });
        }

        function busqueda_asignado_change() {
            if (tableroTicketsCtrl.status != undefined) {
                consultaDetalle(tableroTicketsCtrl.status);
            }
        }

        function mostrar_buscador(area_item) {
            //listar los asignados para rol diferente de gerente
            if (tableroTicketsCtrl.user.perfil != "8") {
                mostrar_action();
            } else {
                if (area_item != undefined && area_item != null) {
                    tableroTicketsCtrl.user.imostrar = "1";
                    mostrar_action();
                    tableroTicketsCtrl.user.idArea = area_item.idArea;
                    areas_action();
                }
            }
            
        }

        function quitar_usuario_asignado() {
            tableroTicketsCtrl.usuarioAsignado = undefined;
            busqueda_asignado_change();
        }

        function consultaPlantillaArea() {
            $log.info("ConsultaPlantilla----");
            $log.info(tableroTicketsCtrl.user.idArea);
            var params = {
                idArea: tableroTicketsCtrl.user.idArea,
                estatus: "A"
            };
            var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;
            promesa.then(function (respuesta) {

                tableroTicketsCtrl.plantillaArea = respuesta;
                if (tableroTicketsCtrl.plantillaArea.length == 0) {
                    AdeaServicios.alerta("error", "No existen recursos registrados para el área seleccionada");
                }

            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los recursos del área: " + error.data);
            });
        }

        function consultaTotales(usuarioAsignado, idArea, idCategoria) {
            $log.info('---consultaTotales---');

            tableroTicketsCtrl.tablero = {};

            var params = {
                usuarioAsignado: usuarioAsignado,
                idArea: idArea,
                idCategoria: idCategoria
            };
            var promesa = tableroServicios.getTotalesTickets(params).$promise;

            promesa.then(function (respuesta) {
                tableroTicketsCtrl.tablerolist = respuesta;
                $log.info(respuesta);

                angular.forEach(respuesta, function (obj) {
                    switch (obj.estatus) {
                        case "1":
                            tableroTicketsCtrl.tablero.nueva = obj;
                            break;
                        case "2":
                            tableroTicketsCtrl.tablero.mas_datos = obj;
                            break;
                        case "3":
                            tableroTicketsCtrl.tablero.confirmada = obj;
                            break;
                        case "4":
                            tableroTicketsCtrl.tablero.atendida = obj;
                            break;
                        case "5":
                            tableroTicketsCtrl.tablero.suspendida = obj;
                            break;
                        case "6":
                            tableroTicketsCtrl.tablero.cerrada = obj;
                            break;
                        case "7":
                            tableroTicketsCtrl.tablero.asignada = obj;
                            break;
                        case "8":
                            tableroTicketsCtrl.tablero.analisis_dat = obj;
                            break;
                    }
                });

            });

            promesa.catch(function (error) {
                $log.error(error);
                AdeaServicios.alerta("error", "Error al consultar el tablero");
            });
        }

        function consultaDetalle(status) {
            $log.info('---consultaDetalle---');
            tableroTicketsCtrl.status = status;
            var usuarioAsignado;
            var idArea;
            var idCategoria;
            //muestra por asignados
            if (tableroTicketsCtrl.user.imostrar != 1) {
                usuarioAsignado = tableroTicketsCtrl.user.usuario;
                idArea = null;
                idCategoria = null;
            } else {
                if (tableroTicketsCtrl.usuarioAsignado != undefined && tableroTicketsCtrl.usuarioAsignado != null) {
                    usuarioAsignado = tableroTicketsCtrl.usuarioAsignado;
                } else {
                    usuarioAsignado = null;
                }
                idArea = tableroTicketsCtrl.user.idArea;
                idCategoria = tableroTicketsCtrl.user.idCategoria;
            }

            var params = {
                usuarioAsignado: usuarioAsignado,
                status: status,
                idArea: idArea,
                idCategoria: idCategoria
            };
            var promesa = tableroServicios.getDetalleTickets(params).$promise;

            promesa.then(function (respuesta) {
                tableroTicketsCtrl.detallelist = respuesta;
                $log.info(respuesta);

            });

            promesa.catch(function (error) {
                $log.error(error);
                AdeaServicios.alerta("error", "Error al consultar el detalle");
            });
        }

        function mostrar_action() {
            $log.info('mostrar_action---');
            $log.info(tableroTicketsCtrl.user.imostrar);
            tableroTicketsCtrl.bcombos = false;
            tableroTicketsCtrl.bareas = false;
            tableroTicketsCtrl.bbusquedaUsuario = false;
            tableroTicketsCtrl.detallelist = [];
            
            if (tableroTicketsCtrl.user.imostrar == "1") {
                tableroTicketsCtrl.bcombos = true;
                tableroTicketsCtrl.bareas = true;
                tableroTicketsCtrl.user.idArea = null;
                tableroTicketsCtrl.user.idCategoria = null;
                tableroTicketsCtrl.usuarioAsignado = undefined;
                tableroTicketsCtrl.bbusquedaUsuario = true;
            } else {
                consultaTotales(tableroTicketsCtrl.user.usuario, null, null);
                consultaDetalle("7");
            }
        }

        function areas_action() {
            tableroTicketsCtrl.bcategorias = false;
            tableroTicketsCtrl.user.idCategoria = null;
            tableroTicketsCtrl.detallelist = [];
            if (tableroTicketsCtrl.user.idArea != "" && tableroTicketsCtrl.user.idArea != null) {

                consultaTotales(null, tableroTicketsCtrl.user.idArea, null);

                tableroTicketsCtrl.bcategorias = true;
                var params = {idArea: tableroTicketsCtrl.user.idArea};
                var promesa = tableroServicios.getCategoriasByArea(params).$promise;

                promesa.then(function (respuesta) {
                    $log.info("Categorias");
                    $log.info(respuesta);
                    tableroTicketsCtrl.categoriaslist = respuesta;
                    consultaPlantillaArea();
                });

                promesa.catch(function (error) {
                    $log.error(error);
                });
            }
        }
        function categorias_action() {
            tableroTicketsCtrl.detallelist = [];
            if (tableroTicketsCtrl.user.idCategoria != "" && tableroTicketsCtrl.user.idCategoria != null) {
                consultaTotales(null, tableroTicketsCtrl.user.idArea, tableroTicketsCtrl.user.idCategoria);
            } else {
                consultaTotales(null, tableroTicketsCtrl.user.idArea, null);
            }
        }


        function buscarTicket() {
            $log.info("buscarTicket Controller");
            $log.info(tableroTicketsCtrl.idticketbusqueda);
            mostrarBusqueda();
        }

        function seleccionarmiTicket(reg) {
            $log.info("Seleccionar mi ticket:");
            $log.info(reg);
            tableroTicketsCtrl.idticketbusqueda = reg.idTicket;
            mostrarBusqueda();
        }

        function mostrarBusqueda() {
            tableroTicketsCtrl.bbuscar = false;

            if (tableroTicketsCtrl.idticketbusqueda != undefined) {
                $timeout(function () {
                    tableroTicketsCtrl.btablero = false;
                    tableroTicketsCtrl.bbuscar = true;
                }, 1000);
            }
        }

        function regresar() {
            tableroTicketsCtrl.btablero = true;
        }

    }
})();