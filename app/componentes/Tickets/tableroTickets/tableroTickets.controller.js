(function () {
    'use strict';

    angular.module('adeaModule').controller('TableroTicketsController', TableroTicketsController);

    TableroTicketsController.$inject = ['$log', '$timeout', 'AdeaServicios', 'tableroServicios', 'tblDetalleTickets'];

    function TableroTicketsController($log, $timeout, AdeaServicios, tableroServicios, tblDetalleTickets) {

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
        tableroTicketsCtrl.user = {};
        tableroTicketsCtrl.bbusquedacorrecta = false;
        tableroTicketsCtrl.idticketbusqueda;
        tableroTicketsCtrl.btablero = true;

        init();
        function init() {
            tableroTicketsCtrl.bareas = false;
            tableroTicketsCtrl.bcategorias = false;
            usuarioLogueado();
        }

        function usuarioLogueado() {
            var promesa = tableroServicios.getUser().$promise;

            promesa.then(function (respuesta) {
                $log.info(respuesta);
                tableroTicketsCtrl.usuario = respuesta.user;
                tableroTicketsCtrl.plantilla = respuesta.plantilla;
                $log.info(tableroTicketsCtrl.usuario.login);
                $log.info(tableroTicketsCtrl.plantilla.perfil);
                tableroTicketsCtrl.user.usuario = tableroTicketsCtrl.usuario.login;
                tableroTicketsCtrl.user.perfil = tableroTicketsCtrl.plantilla.perfil;
//                tableroTicketsCtrl.user.usuario = "rvillanueva";
//                tableroTicketsCtrl.user.perfil = "8";
                tableroTicketsCtrl.bbusqueda = false;
                //caso para gerente - carga combos
                if (tableroTicketsCtrl.user.perfil == "8") {
                    tableroTicketsCtrl.bbusqueda = true;
                    var params = {
                        user: tableroTicketsCtrl.user.usuario
                    };
                    var promesa2 = tableroServicios.getAreasByUser(params).$promise;

                    promesa2.then(function (respuesta2) {
                        $log.info("areas");
                        $log.info(respuesta2);
                        tableroTicketsCtrl.areaslist = respuesta2;
                    });
                    
                    promesa2.catch(function (error2) {
                        $log.error(error2);
                    });
                }
                consultaTotales(tableroTicketsCtrl.user.usuario, null, null);
                //listar por defecto los asignados
                consultaDetalle("7");
            });

            promesa.catch(function (error) {
                $log.error(error);
            });
        }

        function consultaTotales(usuarioAsignado, idArea, idCategoria) {
            $log.info('---consultaTotales---');

            tableroTicketsCtrl.tablero = {};
//            tableroTicketsCtrl.tablero.nueva = {porcentaje: 10, nombreEstatus: "Nueva", noTickets: 100, estatus: "1"};
//            tableroTicketsCtrl.tablero.mas_datos = {porcentaje: 20, nombreEstatus: "Mas datos", noTickets: 200, estatus: "2"};
//            tableroTicketsCtrl.tablero.confirmada = {porcentaje: 30, nombreEstatus: "Confirmada", noTickets: 300, estatus: "3"};
//            tableroTicketsCtrl.tablero.atendida = {porcentaje: 40, nombreEstatus: "Atendida", noTickets: 400, estatus: "4"};
//            tableroTicketsCtrl.tablero.suspendida = {porcentaje: 50, nombreEstatus: "Suspendida", noTickets: 500, estatus: "5"};
//            tableroTicketsCtrl.tablero.cerrada = {porcentaje: 60, nombreEstatus: "Cerrada", noTickets: 600, estatus: "6"};
//            tableroTicketsCtrl.tablero.asignada = {porcentaje: 70, nombreEstatus: "Asignada", noTickets: 700, estatus: "7"};
//            tableroTicketsCtrl.tablero.analisis_dat = {porcentaje: 80, nombreEstatus: "Analisis DAT", noTickets: 800, estatus: "8"};

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
            var usuarioAsignado;
            var idArea;
            var idCategoria;
            //muestra por asignados
            if (tableroTicketsCtrl.user.imostrar != 1) {
                usuarioAsignado = tableroTicketsCtrl.user.usuario;
                idArea = null;
                idCategoria = null;
            } else {
                usuarioAsignado = null;
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

        //tableroTicketsCtrl.bbusqueda = true;
        function mostrar_action() {
            tableroTicketsCtrl.bcombos = false;
            tableroTicketsCtrl.bareas = false;
            tableroTicketsCtrl.detallelist = [];
            if (tableroTicketsCtrl.user.imostrar == 1) {
                tableroTicketsCtrl.bcombos = true;
                tableroTicketsCtrl.bareas = true;
                tableroTicketsCtrl.user.idArea = null;
                tableroTicketsCtrl.user.idCategoria = null;
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
        
        function mostrarBusqueda(){
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