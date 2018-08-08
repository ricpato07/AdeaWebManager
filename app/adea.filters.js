(function () {
    'use strict';

    /**
     *
     * @description
     * Archivo que se encarga de los filtros utilizados dentro del sistema
     */
    angular
            .module('adeaModule')
            .filter('estatus', estatus)
            .filter('estatusAccion', estatusAccion)
            .filter('filtroDinamico', filtroDinamico)
            .filter('fecha', fecha)
            .filter('proyecto', proyecto)
            .filter('formaPago', formaPago)
            .filter('porcentaje', porcentaje)
            .filter('sueldos', sueldos)
            .filter('palomaotache', palomaotache)
            .filter('siono', siono)
            .filter('tipoDato', tipoDato)
            .filter('noaplica', noaplica)
            .filter('positive', positive)
            .filter('sinDatos', sinDatos)
            .filter('tipoPagos', tipoPagos)
            .filter('comision', comision)
            .filter('fechaSFecha', fechaSFecha)
            .filter('moneda', moneda)
            .filter('perfil', perfil)
            .filter('propsFilter', propsFilter)
            .filter('cadenaVacia', cadenaVacia)
            .filter('ordenarListMilis', ordenarListMilis)
            .filter('ordenarList', ordenarList)
            .filter('palomaotacheB', palomaotacheB)
            .filter('renovacion', renovacion)
            .filter('palomaotacheT', palomaotacheT)
            .filter('ordenarListMilisTickets', ordenarListMilisTickets);
       

    /**
     * @type {string[]}
     * @description
     * Filtro que se encarga de colocar un formato '--/--/----'
     * si es que la fecha es nula o undefined, si llega con un
     * valor se le agrega el filtro de fecha mas el formato solicitado
     */
    filtroDinamico.$inject = ['$log', '$filter'];

    function filtroDinamico($log, $filter) {
        return function (dato, filtro, formato) {
            if (filtro == 'date') {
                if (dato == undefined || dato == null) {
                    return "--/--/----"
                } else {
                    return $filter(filtro)(dato, formato);
                }
            }

            return $filter(filtro)(dato, formato);
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de los estatus dentro del sistema
     */
    estatus.$inject = ['$log'];

    function estatus($log) {
        return function (codEstatus) {
            if (codEstatus === 'GRA') {
                return 'Grabación';
            } else if (codEstatus === 'MOD') {
                return 'Modificación';
            } else if (codEstatus === 'SUS') {
                return 'Suspendido';
            } else if (codEstatus === 'ACT') {
                return 'Activo';
            } else if (codEstatus === 'ASG') {
                return 'Asignado';
            } else if (codEstatus === 'REC') {
                return 'Rechazado';
            } else if (codEstatus === 'COL') {
                return 'Colaborador';
            } else if (codEstatus === 'ASG') {
                return 'Asignado';
            } else if (codEstatus === 'DIS') {
                return 'Disponible';
            } else if (codEstatus === 'AUT') {
                return 'Autorizado';
            } else if (codEstatus === 'ACE') {
                return 'Aceptado';
            } else if (codEstatus === 'PUB') {
                return 'Publicada';
            } else if (codEstatus === 'LIQ') {
                return 'Liquidada';
            } else if (codEstatus === 'CER') {
                return 'Cerrada';
            } else if (codEstatus === 'DEP') {
                return 'Depositada';
            } else if (codEstatus === 'ENT') {
                return 'Entregado';
            } else if (codEstatus === 'CAN') {
                return 'Cancelada';
            } else if (codEstatus === 'REP') {
                return 'Reproceso';
            } else if (codEstatus === 'FIN') {
                return 'Finalizado';
            } else {
                codEstatus;
            }
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de los estatus dentro del sistema
     */
    estatusAccion.$inject = ['$log'];

    function estatusAccion($log) {
        return function (codEstatus) {
            if (codEstatus === 'GRA') {
                return 'Grabo';
            } else if (codEstatus === 'P') {
                return 'En Proceso (Desarrollo)';
            } else if (codEstatus === 'S') {
                return 'Suspendido';
            } else if (codEstatus === 'A') {
                return 'Activo';
            } else if (codEstatus === 'QA') {
                return 'En QA';
            } else if (codEstatus === 'QAU') {
                return 'En QA Usuario';
            } else if (codEstatus === 'T') {
                return 'Terminado';
            } else if (codEstatus === 'S') {
                return 'Suspendido';
            } else if (codEstatus === 'ED') {
                return 'En espera de Datos';
            } else if (codEstatus === 'I') {
                return 'Inactivo';
            } else if (codEstatus === 'B') {
                return 'Baja';
            } else {
                codEstatus;
            }
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar la fecha en formato de dia, mes, año, horas y segundos
     * si llega un valor nulo pone lineas para distingien no q hay fecha '--/--/----'
     */
    fecha.$inject = ['$filter', '$log'];

    function fecha($filter, $log) {
        return function (fechaOriginal) {
            if (fechaOriginal == undefined || fechaOriginal == null) {
                return "--/--/----"
            } else {
                var myDate = moment(fechaOriginal);
                var fec = myDate.format("DD/MM/YYYY HH:mm:ss");
                return fec
            }

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar la fecha en formato de dia, mes, año
     * si llega un valor nulo pone lineas para distingien no q hay fecha '--/--/----'
     */
    fechaSFecha.$inject = ['$filter', '$log'];

    function fechaSFecha($filter, $log) {
        return function (fechaOriginal) {
            if (fechaOriginal == undefined || fechaOriginal == null) {
                return "--/--/----"
            } else {
                var myDate = moment(fechaOriginal);
                var fec = myDate.format("DD/MM/YYYY");
                return fec
            }

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar Empleado de fabrica simpre y cuando esl valor llege nulo
     */
    proyecto.$inject = ['$filter', '$log'];

    function proyecto($filter, $log) {
        return function (proyecto) {
            if (proyecto == undefined || proyecto == null) {
                return "Empleado de Fabrica"
            } else {
                return proyecto
            }

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar los titulos a
     * las formas de pago que existen dentro del sistema
     */
    formaPago.$inject = ['$filter', '$log'];

    function formaPago($filter, $log) {
        return function (formaPagos) {
            if (formaPagos == 'N') {
                return "Nomina"
            } else if (formaPagos == 'A') {
                return "Ayuda Economica"
            } else if (formaPagos == 'F') {
                return "Facturación"
            } else {
                return formaPagos
            }

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato de los numeros para que
     * sean de tipo monead ademas de agregarle el simbolo $ al inicio con 2 decimales,
     * y si llega vacio colocar un no aplica par aalgunas partes de los segmentos
     */
    sueldos.$inject = ['$filter', '$log'];

    function sueldos($filter, $log) {
        return function (sueldo) {
            if (sueldo == null)
                return 'No aplica';
            return '$' + $filter('number')(sueldo, "2");

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato los porentajes dentro del sistema con su simbolo % ,
     * si el valor es nulo coloca un no aplica
     */
    porcentaje.$inject = ['$filter', '$log'];

    function porcentaje($filter, $log) {
        return function (porcentajes) {
            if (porcentajes == null)
                return 'No aplica';
            return porcentajes + '%';

        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el un valor icono, dependiendo del
     * valor que llege si es true una paloma si es falso un tache
     */
    palomaotache.$inject = [];

    function palomaotache() {
        return function (valorBoolenano) {
            if (valorBoolenano === 'S') {
                return '\u2713';
            } else {
                return '\u2718';
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el un valor icono, dependiendo del
     * valor que llege si es true una paloma si es falso un tache
     */
    palomaotacheT.$inject = [];

    function palomaotacheT() {
        return function (valorBoolenano) {
            if (valorBoolenano === 'T') {
                return '\u2713';
            } else {
                return '\u2718';
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el un valor icono, dependiendo del
     * valor que llege si es true una paloma si es falso un tache
     */
    palomaotacheB.$inject = [];

    function palomaotacheB() {
        return function (valorBoolenano) {
            if (valorBoolenano === 'true') {
                return '\u2713';
            } else {
                return '\u2718';
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar solo la palabra SI si el valor que llega es S,
     * NO si es valor es N
     */
    siono.$inject = [];

    function siono() {
        return function (sino) {
            if (sino === 'S') {
                return 'SI';
            } else if (sino === 'N') {
                return 'NO';
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar La frase no aplica si es que el valor que llega,
     * es nulo  undefined
     */
    noaplica.$inject = [];

    function noaplica() {
        return function (noaplicas) {
            if (noaplicas == '') {
                return 'No Aplica';
            } else if (noaplicas == undefined) {
                return 'No Aplica';
            } else if (noaplicas == null) {
                return 'No Aplica';
            } else {
                return noaplicas;
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar la palabra dependiedo de que tipo de dato es
     * al que se refiere el valor que trae C si es caracter, A anfanumerico  y N si es Numérico
     */
    tipoDato.$inject = [];

    function tipoDato() {
        return function (dato) {
            if (dato == 'C') {
                return 'Caracter';
            } else if (dato == 'N') {
                return 'Numérico';
            } else if (dato == 'A') {
                return 'Alfanumerico';
            } else {
                return dato;
            }
        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el valor numerico en formato de positivo
     * ademas de agregar el formato numérico con el simbolo $
     */
    positive.$inject = ['$filter'];

    function positive($filter) {
        return function (input) {
            if (!input) {
                return 0;
            }
            return '$' + $filter('number')(Math.abs(input), '2');
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato los porentajes dentro del sistema con su simbolo % ,
     * si el valor es nulo coloca un no aplica
     */
    sinDatos.$inject = ['$filter', '$log'];

    function sinDatos($filter, $log) {
        return function (dato) {
            if (dato == null || dato == "undefined" || dato == undefined) {
                return 'Sin Observación';
            } else {
                return dato;
            }
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato los porentajes dentro del sistema con su simbolo % ,
     * si el valor es nulo coloca un no aplica
     */
    tipoPagos.$inject = ['$filter', '$log'];

    function tipoPagos($filter, $log) {
        return function (dato) {
            if (dato == 'T') {
                return 'Transferencia';
            } else if (dato == 'E') {
                return 'Efectivo';
            } else {
                return dato;
            }
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato los porentajes dentro del sistema con su simbolo % ,
     * si el valor es nulo coloca un no aplica
     */
    comision.$inject = ['$filter', '$log'];

    function comision($filter, $log) {
        return function (dato) {
            if (dato == 'M') {
                return 'Monto';
            } else if (dato == 'P') {
                return 'Porcentaje';
            } else {
                return dato;
            }
        };
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de colocar el formato los porentajes dentro del sistema con su simbolo % ,
     * si el valor es nulo coloca un no aplica
     */
    moneda.$inject = ['$filter', '$log'];

    function moneda($filter, $log) {
        return function (dato) {
            if (dato != null && dato != '' && dato != undefined) {
                return $filter('currency')(dato, '$', 2);
            } else {
                return '$ 0';
            }
        };
    }

    perfil.$inject = ['$filter', '$log'];

    function perfil($filter, $log) {
        return function (dato) {
            if (dato == 11) {
                return 'Lider';
            } else if (dato == 22) {
                return 'Desarrollador';
            } else if (dato == 3) {
                return 'Analista';
            } else if (dato = 4) {
                return 'Analista DAT'
            }

        };
    }

    propsFilter.$inject = ['$log'];

    function propsFilter($log) {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function (item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();

                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }

    ordenarList.$inject = ['$filter', '$log'];

    function ordenarList($filter, $log) {
        return function (items) {
            return $filter('orderBy')(items, function (item) {

                return item.fecIni;
            });
        }
    }

    ordenarListMilis.$inject = ['$filter', '$log'];

    function ordenarListMilis($filter, $log) {
        return function (items) {

            return $filter('orderBy')(items, function (item) {

                if (item.fecIni instanceof Date) {
                    return item.fecIni.getTime();
                } else {

                    return item.fecIni;
                }
            });
        }
    }

    cadenaVacia.$inject = ['$filter', '$log'];

    function cadenaVacia($filter, $log) {
        return function (cadena) {

            if (cadena == null) {
                return '---';
            } else {
                return cadena;
            }

        }
    }

    /**
     * @type {string[]}
     * @description
     * Filtro encargado de los estatus dentro del sistema
     */
    renovacion.$inject = ['$log'];

    function renovacion($log) {
        return function (codEstatus) {
            if (codEstatus === 'A') {
                return 'AUTORENOBABLE';
            } else if (codEstatus === 'F') {
                return 'FINITO';
            } else if (codEstatus === 'P') {
                return 'PENDIENTE';
            } else {
                codEstatus;
            }
        };
    }


    /**
     * @type {string[]}
     * @description
     * Filtro encargado de los estatus dentro del sistema
     */
    tipoPoliza.$inject = ['$log'];

    function tipoPoliza($log) {
        return function (codEstatus) {
            if (codEstatus === 1) {
                return 'SEGURO';
            } else if (codEstatus === 2) {
                return 'GARANTIA';
            } else {
                codEstatus;
            }
        };
    }

    ordenarListMilisTickets.$inject = ['$filter', '$log'];

    function ordenarListMilisTickets($filter, $log) {
        return function (items) {

            return $filter('orderBy')(items, function (item) {

                if (item.fecha instanceof Date) {
                    return item.fecha.getTime();
                } else {

                    return item.fecha;
                }
            });
        }
    }


})();
