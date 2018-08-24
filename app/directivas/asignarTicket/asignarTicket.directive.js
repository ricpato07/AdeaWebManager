(function () {

    /**
     * @ngdoc directive
     * @name xsAdmin.directive:asignarTickets
     * @scope
     * @restrict E
     * @description Directiva que se encarga de la búsqueda del ticket
     */
    angular
            .module('adeaDirectivas')
            .controller('asignarTicketController', asignarTicketController)
            .directive('asignarTicketDir', asignarTicketDir);
    asignarTicketDir.$inject = ['$log'];
    asignarTicketController.$inject = ['$log', '$scope', '$timeout', 'AdeaServicios', 'tableroServicios', 'proyectoServicios'];
    function asignarTicketController($log, $scope, $timeout, AdeaServicios, tableroServicios, proyectoServicios) {

        var asignarTicketCtrl = this;
        asignarTicketCtrl.asignado_change = asignado_change;
        asignarTicketCtrl.asignarTicket = asignarTicket;
        asignarTicketCtrl.atencion_change = atencion_change;
        asignarTicketCtrl.complejidad_change = complejidad_change;
        asignarTicketCtrl.tiempo_change = tiempo_change;
        asignarTicketCtrl.fecha_entrega_change = fecha_entrega_change;
        asignarTicketCtrl.aceptarModal = aceptarModal;
        asignarTicketCtrl.cancelarModal = cancelarModal;
        asignarTicketCtrl.comentario_change = comentario_change;
        asignarTicketCtrl.disabledDays = disabledDays;
        asignarTicketCtrl.idticketbusqueda = $scope.idticketbusqueda;
        asignarTicketCtrl.bbuscar = $scope.bbuscar;
        asignarTicketCtrl.usuario = $scope.usuario;
        asignarTicketCtrl.perfil = $scope.perfil;
        asignarTicketCtrl.miTicket = {};
        asignarTicketCtrl.area = {};
        asignarTicketCtrl.fechaEntrega = {};
        asignarTicketCtrl.fechaEntrega.minDate = new Date();
        asignarTicketCtrl.tiempoAtencion = new Date(1900, 1, 1);
        asignarTicketCtrl.tiempoAtencion.setHours(0);
        asignarTicketCtrl.tiempoAtencion.setMinutes(0);
        asignarTicketCtrl.horas = 0;
        asignarTicketCtrl.ultimoticketlist = undefined;
        asignarTicketCtrl.usuarioAsignado = undefined;
        asignarTicketCtrl.modal = {};
        asignarTicketCtrl.modal.titulo = "Confirmar asignación";
        asignarTicketCtrl.modal.mensaje = "Al reasignar este ticket cambiará la información del ticket pero es necesario actualizar la planeación de las actividades. ¿Deseas continuar?";
        asignarTicketCtrl.modal.show_modal = false;
        asignarTicketCtrl.modal.baceptarModal = false;
        var ultima_actividad;
        cargar_consultas();

        /*Datos para pruebas*/
        /*
         asignarTicketCtrl.area.tipoFlujo = 1;
         asignarTicketCtrl.miTicket.nombreArea = "Sistemas";
         asignarTicketCtrl.miTicket.nombreCategoria = "Soporte aplicativo";
         asignarTicketCtrl.tipoFlujo = asignarTicketCtrl.area.tipoFlujo.toString();
         asignarTicketCtrl.miTicket.usuarioAsignado = "rgarciau";
         asignarTicketCtrl.miTicket.complejidad = "A";
         asignarTicketCtrl.miTicket.tiempoAtencion = asignarTicketCtrl.tiempoAtencion;
         asignarTicketCtrl.ultimoticketlist = [
         {id: 1, horasAsig: 5, fecFin: asignarTicketCtrl.fechaEntrega.minDate, nombreActividad: "Actividad de prueba"},
         {id: 2, horasAsig: 2, fecFin: asignarTicketCtrl.fechaEntrega.minDate, nombreActividad: "Es una actividad de la causa"}
         ];
         getUltimaActividad(asignarTicketCtrl.ultimoticketlist);
         tipo_flujo_action(asignarTicketCtrl.area.tipoFlujo, false);
         asignarTicketCtrl.miTicket.reAsigna = 1;
         asignarTicketCtrl.bcomentario = true;
         asignarTicketCtrl.beditar = false;
         */

        function cargar_consultas() {
            buscarTicket($scope.idticket);
            consultaComplejidad();
            consultaDiasFestivos();
        }

        function buscarTicket(idticketBusqueda) {

            $log.info("buscarTicket directive");
            $log.info(idticketBusqueda);
            if (idticketBusqueda == undefined || idticketBusqueda == null) {
                return null;
            }

            var idTicket = Number(idticketBusqueda);
            var params = {
                idTicket: idTicket
            };
            var promesa = tableroServicios.getTicket(params).$promise;
            promesa.then(function (respuesta) {
                $log.info("asignarTicketCtrl.miTicket");
                $log.info(respuesta);
                asignarTicketCtrl.miTicket = respuesta;
                consultaPlantillaArea();
                //si no tiene tipo flujo lo va a obtener del área del ticket
                if (asignarTicketCtrl.miTicket.tipoFlujo == null) {
                    consultaAreaObjeto();
                } else {
                    asignarTicketCtrl.tipoFlujo = asignarTicketCtrl.miTicket.tipoFlujo.toString();
                    tipo_flujo_action(asignarTicketCtrl.miTicket.tipoFlujo, false);
                }

                if (asignarTicketCtrl.miTicket.tiempoAtencion == null) {
                    asignarTicketCtrl.miTicket.tiempoAtencion = asignarTicketCtrl.tiempoAtencion;
                }

                valida_BAsignar(false);

                asignarTicketCtrl.usuarioAsignado = asignarTicketCtrl.miTicket.usuarioAsignado;
                asignarTicketCtrl.miTicket.bAsignado = 0;
                asignarTicketCtrl.beditar = true;
                asignarTicketCtrl.beditar_atencion = true;

                if (asignarTicketCtrl.miTicket.usuarioAsignado != null) {
                    if (asignarTicketCtrl.miTicket.fechaEntrega != undefined && asignarTicketCtrl.miTicket.fechaEntrega != null) {
                        asignarTicketCtrl.miTicket.bAsignado = 1;
                        asignarTicketCtrl.beditar_atencion = false;
                        valida_reAsignacion();
                    }
                }
            });
            promesa.catch(function (error) {
                $log.error(error);
                AdeaServicios.alerta("error", "Error al obtener el ticket");
            });
        }

        asignarTicketCtrl.abrirFechaEntrega = function () {
            $log.info(asignarTicketCtrl.fechaEntrega.minDate);
            asignarTicketCtrl.fechaEntrega.abierto = true;
        };

        function fecha_entrega_change() {
            $log.info("fecha_entrega_change");
            valida_BAsignar(false);
        }

        function consultaDiasFestivos() {
            $log.info("consultaDiasFestivos");
            var promesaList = AdeaServicios.consultaDiasFestivos().$promise;
            promesaList.then(function (respuesta) {
                $log.info(respuesta);
                asignarTicketCtrl.diasFestivos = respuesta;
            });
            promesaList.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los días festivos: " + error.data);
            });
        }

        function disabledDays(data) {
            var date = data.date,
                    mode = data.mode;
            var bndDay = false;

            angular.forEach(asignarTicketCtrl.diasFestivos, function (obj) {
                if (data.date.getTime() == obj.holiday) {
                    bndDay = true;
                }
            });

            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) || bndDay;
        }


        function asignado_change() {
            $log.info("asignado_change");
            $log.info(asignarTicketCtrl.miTicket.usuarioAsignado);

            asignarTicketCtrl.horas = 0;
            asignarTicketCtrl.ultimoticketlist = undefined;
            asignarTicketCtrl.miTicket.fechaInicio = new Date();
            asignarTicketCtrl.miTicket.fechaEntrega = undefined;

            if (asignarTicketCtrl.miTicket.usuarioAsignado != undefined) {
                valida_BAsignar(false);
                //solo aplica las actividades para el tipo flujo 1
                if (asignarTicketCtrl.tipoFlujo == "1") {

                    valida_reAsignacion();

                    var params = {
                        user: asignarTicketCtrl.miTicket.usuarioAsignado
                    };
                    var promesa = tableroServicios.getUltimasActividades(params).$promise;
                    promesa.then(function (respuesta) {
                        asignarTicketCtrl.ultimoticketlist = respuesta;
                        getUltimaActividad(asignarTicketCtrl.ultimoticketlist);
                    });
                    promesa.catch(function (error) {
                        getUltimaActividad(asignarTicketCtrl.ultimoticketlist);
                        AdeaServicios.alerta("error", "Error al consultar");
                    });
                }
            }
        }

        function valida_reAsignacion() {
            $log.info("valida_reAsignacion");

            if (asignarTicketCtrl.tipoFlujo == "1") {
                asignarTicketCtrl.beditar = true;
                var params = {
                    user: asignarTicketCtrl.miTicket.usuarioAsignado,
                    idTicket: asignarTicketCtrl.miTicket.idTicket
                };
                var promesa = tableroServicios.getUltimoSubproyecto(params).$promise;
                promesa.then(function (respuesta) {
                    $log.info("respuesta.idSubProyecto ");
                    $log.info(respuesta.idSubProyecto);
                    $log.info("asignarTicketCtrl.miTicket.reAsigna");
                    $log.info(asignarTicketCtrl.miTicket.reAsigna);
                    //si esta asignado y no se va a reasignar
                    //si idSubProyecto es 0 no es el ultimo subproyecto

                    if (asignarTicketCtrl.miTicket.bAsignado == 1 && asignarTicketCtrl.miTicket.reAsigna == 0) {
                        if (respuesta.idSubProyecto == 0) {
                            asignarTicketCtrl.beditar = false;
                        }
                    }
                    $log.info(asignarTicketCtrl.beditar);
                });
                promesa.catch(function (error) {
                    AdeaServicios.alerta("error", "Error al obtener el último subproyecto");
                });
            }
        }

        function getUltimaActividad(lista) {
            $log.info("getUltimaActividad");
            $log.info(lista);

            if (lista != undefined && lista != null && lista.length > 0) {
                ultima_actividad = angular.copy(lista[0]);
                if (lista.length > 1) {
                    angular.forEach(lista, function (obj) {
                        asignarTicketCtrl.horas = asignarTicketCtrl.horas + obj.horasAsig;
                    });
                } else {
                    asignarTicketCtrl.horas = ultima_actividad.horasAsig;
                }
                $log.info("horas");
                $log.info(asignarTicketCtrl.horas);
                $log.info("ultima_actividad");
                $log.info(ultima_actividad);

                asignarTicketCtrl.miTicket.fechaInicio = getValidDay(ultima_actividad.fecFin);
                if (asignarTicketCtrl.horas >= 9) {
                    var fechaInicio = angular.copy(asignarTicketCtrl.miTicket.fechaInicio);
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                    asignarTicketCtrl.miTicket.fechaInicio = getValidDay(fechaInicio);
                }
            }
            tiempo_change();
        }

        function getValidDay(date) {
            date = getDateFormat(date);
            while (!isValidDay(date)) {
                date.setDate(date.getDate() + 1);
            }
            return date;
        }

        function isValidDay(date) {
            $log.info("isValidDay");
            $log.info(date);

            if (date.getDay() === 0 || date.getDay() === 6) {
                return false;
            }
            var encontrado = false;
            angular.forEach(asignarTicketCtrl.diasFestivos, function (obj) {
                if (date.getTime() == obj.holiday) {
                    $log.info("encontrado");
                    encontrado = true;
                }
            });
            if (encontrado) {
                return false;
            }
            return true;
        }
        function tiempo_change() {
            $log.info("tiempo_change");
            var tiempo_acumulado = 0;
            var HORAS_DIA = 9;
            if (asignarTicketCtrl.miTicket.fechaInicio != undefined && asignarTicketCtrl.miTicket.fechaInicio != null) {
                if (asignarTicketCtrl.miTicket.tiempoAtencion != undefined && asignarTicketCtrl.miTicket.tiempoAtencion != null) {
                    var tiempoAtencion = getDateFormat(asignarTicketCtrl.miTicket.tiempoAtencion);
                    asignarTicketCtrl.miTicket.fechaInicio = getDateFormat(asignarTicketCtrl.miTicket.fechaInicio);
                    tiempo_acumulado = tiempoAtencion.getHours();
                    //solo aplica para el flujo 1 planeación
                    if (asignarTicketCtrl.tipoFlujo == "1") {
                        if (ultima_actividad != undefined && ultima_actividad != null) {
                            $log.info("asignarTicketCtrl.miTicket.fechaInicio.getTime()");
                            $log.info(asignarTicketCtrl.miTicket.fechaInicio.getTime());
                            $log.info("ultima_actividad.fecFin");
                            $log.info(ultima_actividad.fecFin);
                            if (asignarTicketCtrl.miTicket.fechaInicio.getTime() == ultima_actividad.fecFin) {
                                if (asignarTicketCtrl.horas < HORAS_DIA) {
                                    tiempo_acumulado = tiempo_acumulado + asignarTicketCtrl.horas;
                                }
                            }
                        }
                    }
                    $log.info("tiempo_acumulado");
                    $log.info(tiempo_acumulado);

                    asignarTicketCtrl.miTicket.fechaEntrega = angular.copy(asignarTicketCtrl.miTicket.fechaInicio);
                    var sum_dias;
                    var div = Math.trunc(tiempo_acumulado / HORAS_DIA);
                    var mod = tiempo_acumulado % HORAS_DIA;

                    if (div > 0) {
                        sum_dias = div;
                        if (mod == 0) {
                            sum_dias = sum_dias - 1;
                        }

                        var fechaEntrega = angular.copy(asignarTicketCtrl.miTicket.fechaEntrega);
                        fechaEntrega.setDate(fechaEntrega.getDate() + sum_dias);
                        asignarTicketCtrl.miTicket.fechaEntrega = getValidDay(fechaEntrega);
                    }
                }
            }
            valida_BAsignar(false);
        }

        function getDateFormat(fecha) {
            var vfecha;
            if (fecha == undefined || fecha == null) {
                return fecha;
            } else if (typeof fecha == 'number') {
                vfecha = new Date(fecha);
            } else {
                vfecha = fecha;
            }
            return vfecha;
        }

        function consultaComplejidad() {
            $log.info("ConsultaComplejidad-------");
            var promesa = tableroServicios.getComplejidad().$promise;
            promesa.then(function (respuesta) {
                $log.info(respuesta);
                asignarTicketCtrl.complejidadlist = respuesta;
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar la complejidad");
            });
        }

        function consultaPlantillaArea() {
            $log.info("ConsultaPlantilla----");
            $log.info(asignarTicketCtrl.miTicket.idArea);
            var params = {
                idArea: asignarTicketCtrl.miTicket.idArea,
                estatus: "A"
            };
            var promesa = proyectoServicios.consultaPlantillaArea(params).$promise;
            promesa.then(function (respuesta) {

                asignarTicketCtrl.plantillaArea = respuesta;
                if (asignarTicketCtrl.plantillaArea.length == 0) {
                    AdeaServicios.alerta("error", "No existen recursos registrados para el area seleccionada");
                }

            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar los recursos del área: " + error.data);
            });
        }

        function consultaAreaObjeto() {
            $log.info("consultaAreaObjeto----");
            $log.info(asignarTicketCtrl.miTicket.idArea);
            var params = {
                idArea: asignarTicketCtrl.miTicket.idArea
            };
            var promesa = proyectoServicios.consultaAreaObjeto(params).$promise;
            promesa.then(function (respuesta) {
                asignarTicketCtrl.area = respuesta;
                $log.info(respuesta);
                if (asignarTicketCtrl.area != undefined) {
                    asignarTicketCtrl.tipoFlujo = asignarTicketCtrl.area.tipoFlujo.toString();
                    tipo_flujo_action(asignarTicketCtrl.area.tipoFlujo, false);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al consultar el área: " + error.data);
            });
        }

        function tipo_flujo_action(tipoFlujo, batencion) {
            $log.info("tipo_flujo_action");
            $log.info(tipoFlujo);
            asignarTicketCtrl.btipoatencion = false;
            asignarTicketCtrl.busuarioasignado = false;
            asignarTicketCtrl.btiempoestimado = false;
            asignarTicketCtrl.bcomplejidad = false;
            asignarTicketCtrl.btiempoestimado = false;
            asignarTicketCtrl.bfechainicio = false;
            asignarTicketCtrl.bfechatermino = false;
            asignarTicketCtrl.bfecha_est_entrega = false;
            switch (tipoFlujo) {
                case 1:
                    asignarTicketCtrl.btipoatencion = true;
                    asignarTicketCtrl.busuarioasignado = true;
                    asignarTicketCtrl.btiempoestimado = true;
                    asignarTicketCtrl.bcomplejidad = true;
                    asignarTicketCtrl.bfechainicio = true;
                    asignarTicketCtrl.bfechatermino = true;
                    break;
                case 2:
                    if (batencion) {
                        asignarTicketCtrl.btipoatencion = true;
                    }
                    asignarTicketCtrl.busuarioasignado = true;
                    asignarTicketCtrl.btiempoestimado = true;
                    asignarTicketCtrl.bcomplejidad = true;
                    asignarTicketCtrl.btiempoestimado = true;
                    asignarTicketCtrl.bfecha_est_entrega = true;
                case 3:
                    asignarTicketCtrl.busuarioasignado = true;
            }
            valida_BAsignar(false);
        }

        function complejidad_change() {
            $log.info("complejidad_change");
            valida_BAsignar(false);
        }

        function comentario_change() {
            $log.info("comentario_change");
            valida_BAsignar(false);
        }

        function atencion_change(tipoFlujo) {
            $log.info("atencion_change");
            $log.info(tipoFlujo);
            $log.info(typeof tipoFlujo);
            asignarTicketCtrl.tipoFlujo = tipoFlujo;
            tipo_flujo_action(Number(tipoFlujo), true);
            asignarTicketCtrl.ultimoticketlist = undefined;
            asignarTicketCtrl.miTicket.usuarioAsignado = undefined;
            asignarTicketCtrl.miTicket.fechaInicio = undefined;
            asignarTicketCtrl.miTicket.fechaEntrega = undefined;
            asignarTicketCtrl.miTicket.tiempoAtencion = asignarTicketCtrl.tiempoAtencion;
        }

        function aceptarModal() {
            $log.info("aceptarModal asignarTicket");
            asignarTicketCtrl.modal.baceptarModal = true;
            asignarTicket();
        }

        function cancelarModal() {
            $log.info("cancelarModal asignarTicket");
            $timeout(function () {
                asignarTicketCtrl.modal.show_modal = false;
            }, 1000);
        }

        function valida_BAsignar(msg) {
            $log.info("valida_BAsignar");

            if (asignarTicketCtrl.btipoatencion) {
                if (asignarTicketCtrl.tipoFlujo == undefined || asignarTicketCtrl.tipoFlujo == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Es necesario seleccionar el tipo de atención");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }
            if (asignarTicketCtrl.busuarioasignado) {
                if (asignarTicketCtrl.miTicket.usuarioAsignado == undefined || asignarTicketCtrl.miTicket.usuarioAsignado == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Debes colocar al usuario al que se le asignará el ticket");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
                //valida si es reasignación que el usuario sea diferente
                asignarTicketCtrl.bcomentario = false;
                asignarTicketCtrl.miTicket.reAsigna = 0;
                if (asignarTicketCtrl.tipoFlujo == "1" || asignarTicketCtrl.tipoFlujo == "2") {
                    if (asignarTicketCtrl.miTicket.bAsignado == 1 && asignarTicketCtrl.usuarioAsignado != asignarTicketCtrl.miTicket.usuarioAsignado) {
                        asignarTicketCtrl.miTicket.reAsigna = 1;
                        asignarTicketCtrl.bcomentario = true;
                    }
                }
            }
            if (asignarTicketCtrl.bcomplejidad) {
                if (asignarTicketCtrl.miTicket.complejidad == undefined || asignarTicketCtrl.miTicket.complejidad == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Es necesario seleccionar la complejidad");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }
            if (asignarTicketCtrl.btiempoestimado) {
                var tiempoAtencion;
                if (typeof asignarTicketCtrl.miTicket.tiempoAtencion == 'number') {
                    tiempoAtencion = new Date(asignarTicketCtrl.miTicket.tiempoAtencion);
                } else {
                    tiempoAtencion = asignarTicketCtrl.miTicket.tiempoAtencion;
                }

                if (tiempoAtencion == undefined || (tiempoAtencion.getHours() == 0 && tiempoAtencion.getMinutes() == 0)) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Debes colocar el tiempo estimado de atención");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }
            if (asignarTicketCtrl.bfecha_est_entrega) {
                if (asignarTicketCtrl.miTicket.fechaEntrega == undefined || asignarTicketCtrl.miTicket.fechaEntrega == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Debes colocar la fecha estimada de entrega");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }
            if (asignarTicketCtrl.bfechainicio) {
                if (asignarTicketCtrl.miTicket.fechaInicio == undefined || asignarTicketCtrl.miTicket.fechaInicio == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Debes seleccionar al usuario asignado para calcular la fecha de inicio");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }
            if (asignarTicketCtrl.bfechatermino) {
                if (asignarTicketCtrl.miTicket.fechaEntrega == undefined || asignarTicketCtrl.miTicket.fechaEntrega == null) {
                    asignarTicketCtrl.btnAsignar = false;
                    if (msg == true) {
                        AdeaServicios.alerta("error", "Debes seleccionar el tiempo estimado de atención para la fecha de entrega");
                    }
                    return asignarTicketCtrl.btnAsignar;
                }
            }

            // si no se puede editar no habilita el botón para asignar
            if (!asignarTicketCtrl.beditar) {
                asignarTicketCtrl.btnAsignar = false;
                return asignarTicketCtrl.btnAsignar;
            }

//            if (asignarTicketCtrl.bcomentario) {
//                if (asignarTicketCtrl.miTicket.motivoReasigna == undefined || asignarTicketCtrl.miTicket.motivoReasigna == null) {
//                    asignarTicketCtrl.btnAsignar = false;
//                    if (msg == true) {
//                        AdeaServicios.alerta("error", "Debes colocar el motivo de la reasignación");
//                    }
//                    return asignarTicketCtrl.btnAsignar;
//                }
//            }

            asignarTicketCtrl.btnAsignar = true;
            return asignarTicketCtrl.btnAsignar;
        }

        function valida_reasignacion() {
            $log.info("asignarTicketCtrl.tipoFlujo");
            $log.info(asignarTicketCtrl.tipoFlujo);

            if (asignarTicketCtrl.tipoFlujo == "2") {
                if (asignarTicketCtrl.modal.show_modal == false && asignarTicketCtrl.modal.baceptarModal == false) {
                    asignarTicketCtrl.modal.show_modal = true;
                    return true;
                }
            }
            return false;
        }

        function asignarTicket() {
            $log.info("asignarTicket_action");

            if (!valida_BAsignar(true)) {
                return null;
            }
            $log.info("asignarTicketCtrl.miTicket.reAsigna");
            $log.info(asignarTicketCtrl.miTicket.reAsigna);

            if (asignarTicketCtrl.miTicket.reAsigna == 1) {
                if (valida_reasignacion()) {
                    return null;
                }
            }

            //enviar como number el tipo de flujo
            asignarTicketCtrl.miTicket.tipoFlujo = Number(asignarTicketCtrl.tipoFlujo);

            var promesa = tableroServicios.updateAsignarTicket(asignarTicketCtrl.miTicket).$promise;
            promesa.then(function (respuesta) {
                $log.info(respuesta);
                cerrar_modal();
                if (respuesta.error == "ok") {
                    AdeaServicios.alerta("success", "Ticket asignado correctamente");
                    $scope.asignarTicket();
                } else {
                    AdeaServicios.alerta("error", respuesta.error);
                }
            });
            promesa.catch(function (error) {
                AdeaServicios.alerta("error", "Error al asignar ticket");
            });
        }

        function cerrar_modal() {
            $log.info("cerrar_modal");
            $timeout(function () {
                asignarTicketCtrl.modal.show_modal = false;
                asignarTicketCtrl.modal.baceptarModal = false;
            });
        }
    }

    function asignarTicketDir() {
        var directiva = {
            controller: asignarTicketController,
            restrict: 'E',
            controllerAs: 'asignarTicketCtrl',
            transclude: false,
            scope: {
                idticket: '=',
                asignarTicket: '&?'
            },
            templateUrl: 'app/directivas/asignarTicket/asignarTicket.html'
        };
        return directiva;
    }

})();
