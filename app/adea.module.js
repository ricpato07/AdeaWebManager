(function () {
    'use strict';

    /**
     *
     * @type {module|*} Módulo principal de la aplicación.
     *
     * Dependencias:
     *  AngularJS: ngRoute, ngResource, ngAnimate
     *  Aplicación: adeaModule
     *
     */
    angular.module('adeaModule',
        [
            'ngRoute',
            'ngAnimate',
            'ngResource',
            'ngLocale',
            'adeaDirectivas',
            'serviciosModulo',
            'toaster',
            '720kb.datepicker',
            'ui.bootstrap',
            'ui.tree',
            'gantt',
            'gantt.table',
            'gantt.movable',
            'gantt.tooltips',
            'gantt.progress',
            'gantt.tree',
            'gantt.dependencies',
            'gantt.groups',
            'gantt.tree',
            'ui.select',
            'ngSanitize',
            'chart.js',
            'btorfs.multiselect',
            'dndLists',
            'angularFileUpload',
            'blockUI',
            'pdf',
            'fiestah.money',
            'DlhSoft.Kanban.Angular.Components'
        ]);
})();