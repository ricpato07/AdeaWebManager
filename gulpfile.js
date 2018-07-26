/**
 * Created by Ilopezz on 18-01-18
 */
var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require("gulp-concat");
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require("gulp-uglify");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require('gulp-minify-css');
var del = require('del');
var rename = require('gulp-rename');
var directiveReplace = require('gulp-directive-replace');
var Dgeni =  require('dgeni');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var htmlreplace = require('gulp-html-replace');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

/**
 * MODULO: Directivas
 *
 */
gulp.task('templateCashAdeaDir', function () {
    return gulp.src([
        './app/directivas/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaDirectivas",
            prefix: "app/directivas/"
        }))
        .pipe(gulp.dest("./app/dist/directivas/"));
});

gulp.task('concatAdeaDir', ['templateCashAdeaDir'], function () {
    return gulp.src([
        './app/directivas/*.js',
        './app/directivas/**/*.js',
        './app/dist/directivas/**/*.js'
    ])
        .pipe(concat('adeaDirectivasConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});


/**
 * MODULO: plantilla
 *
 */
gulp.task('templateCashPlantilla', function () {
    return gulp.src([
        './app/componentes/plantilla/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/plantilla/"
        }))
        .pipe(gulp.dest("./app/dist/plantilla/"));
});

gulp.task('concatAdeaWMPlantilla', ['templateCashPlantilla'], function () {
    return gulp.src([
        './app/componentes/plantilla/**/*.js',
        './app/dist/plantilla/**/*.js'
    ])
        .pipe(concat('adeaPlantillaConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});


/**
 * MODULO: Proyectos
 *
 */
gulp.task('templateCashProyecto', function () {
    return gulp.src([
        './app/componentes/proyectos/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/proyectos/"
        }))
        .pipe(gulp.dest("./app/dist/proyectos/"));
});

gulp.task('concatProyecto', ['templateCashProyecto'], function () {
    return gulp.src([
        './app/componentes/proyectos/**/*.js',
        './app/dist/proyectos/**/*.js'
    ])
        .pipe(concat('adeaProyectoConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});


/**
 * MODULO: tickets
 *
 */
gulp.task('templateCashTickets', function () {
    return gulp.src([
        './app/componentes/Tickets/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/Tickets/"
        }))
        .pipe(gulp.dest("./app/dist/tickets/"));
});

gulp.task('concatAdeaTickets', ['templateCashTickets'], function () {
    return gulp.src([
        './app/componentes/Tickets/**/*.js',
        './app/dist/tickets/**/*.js'
    ])
        .pipe(concat('adeaTicketsConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});


/**
 * MODULO: reporte
 *
 */
gulp.task('templateCashReporte', function () {
    return gulp.src([
        './app/componentes/reporteContratos/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/reporteContratos/"
        }))
        .pipe(gulp.dest("./app/dist/reporteContratos/"));
});

gulp.task('concatAdeaReporte', ['templateCashReporte'], function () {
    return gulp.src([
        './app/componentes/reporteContratos/**/*.js',
        './app/dist/reporteContratos/**/*.js'
    ])
        .pipe(concat('adeaReporteConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});

/**
 * MODULO: facturacion
 *
 */
gulp.task('templateCashFacturacion', function () {
    return gulp.src([
        './app/componentes/facturacion/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/facturacion/"
        }))
        .pipe(gulp.dest("./app/dist/facturacion/"));
});

gulp.task('concatAdeaFacturacion', ['templateCashFacturacion'], function () {
    return gulp.src([
        './app/componentes/facturacion/**/*.js',
        './app/dist/facturacion/**/*.js'
    ])
        .pipe(concat('adeaFacturacionConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});

/**
 * MODULO: Resumen Proyectos
 *
 */
gulp.task('templateCashResumen', function () {
    return gulp.src([
        './app/componentes/resumenProyectos/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/resumenProyectos/"
        }))
        .pipe(gulp.dest("./app/dist/resumenProyectos/"));
});

gulp.task('concatAdeaResumen', ['templateCashResumen'], function () {
    return gulp.src([
        './app/componentes/resumenProyectos/**/*.js',
        './app/dist/resumenProyectos/**/*.js'
    ])
        .pipe(concat('adeaResumenConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});



/**
 * MODULO: Resumen Proyectos
 *
 */
gulp.task('templateCashSeguimiento', function () {
    return gulp.src([
        './app/componentes/seguimiento/**/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/seguimiento/"
        }))
        .pipe(gulp.dest("./app/dist/seguimiento/"));
});

gulp.task('concatAdeaSeguimiento', ['templateCashSeguimiento'], function () {
    return gulp.src([
        './app/componentes/seguimiento/**/*.js',
        './app/dist/seguimiento/**/*.js'
    ])
        .pipe(concat('adeaSeguimientoConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});


gulp.task('templateCashBlockUi', function () {
    return gulp.src([
        './app/componentes/blockUI/*.html'
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "adeaModule",
            prefix: "app/componentes/blockUI/"
        }))
        .pipe(gulp.dest("./app/dist/blockUI/"));
});

gulp.task('concatAdeaBlockUi', ['templateCashBlockUi'], function () {
    return gulp.src([
        './app/componentes/blockUI/**/*.js',
        './app/dist/blockUI/**/*.js'
    ])
        .pipe(concat('adeablockUIConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});

/**
 * MODULO: ADEAWEB_MANAGER
 */
gulp.task('serviceConcat', function () {
    return gulp.src([

        './app/servicios/servicios.modulo.js',
        './app/servicios/adea.services.js',
        './app/servicios/proyecto.services.js',
        './app/servicios/ticket.service.js',
        './app/servicios/facturacion.service.js',
        './app/servicios/reporte.services.js',
        './app/servicios/mantenimientoFac.services.js',
        './app/servicios/proforma.services.js',
        './app/servicios/tablaValores.js'

    ])
        .pipe(concat('servicesConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});

/**
 * MODULO: ADEAWEB_MANAGER
 */
gulp.task('adeaConcat', function () {
    return gulp.src([

        './app/adea.module.js',
        './app/adea.routes.js',
        './app/adea.runblock.js',
        './app/adea.controller.js',
        './app/adea.constants.js',
        './app/adea.animations.js',
        './app/adea.filters.js'
    ])
        .pipe(concat('adeaConcat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist/archivos/'));
});



gulp.task('buildDist', [
    'concatAdeaDir',
    'concatAdeaWMPlantilla',
    'concatProyecto',
    'concatAdeaTickets',
    'concatAdeaReporte',
    'concatAdeaFacturacion',
    'concatAdeaResumen',
    'concatAdeaSeguimiento',
    'concatAdeaBlockUi',
    'serviceConcat',
    'adeaConcat'
]);


gulp.task('deploy', ['buildDist'], function () {
    return gulp.src([
        './app/dist/archivos/adeaConcat.js',
        './app/dist/archivos/servicesConcat.js',
        './app/dist/archivos/adeaTicketsConcat.js',
        './app/dist/archivos/adeaProyectoConcat.js',
        './app/dist/archivos/adeaPlantillaConcat.js',
        './app/dist/archivos/adeaReporteConcat.js',
        './app/dist/archivos/adeaFacturacionConcat.js',
        './app/dist/archivos/adeaResumenConcat.js',
        './app/dist/archivos/adeaSeguimientoConcat.js',
        './app/dist/archivos/adeablockUIConcat.js',
        './app/dist/archivos/adeaDirectivasConcat.js'

    ])
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('../administracionProyectos/app/'));
});


gulp.task('resources', ['deploy'], function () {
    return gulp.src([
        './app/resources/img/*',
    ])
        .pipe(gulp.dest('../administracionProyectos/app/resources/img/'));
});


gulp.task('kanbanTemplate', ['resources'], function () {
    return gulp.src([
        './app/lib/kanban/**/*',
    ])
        .pipe(gulp.dest('../administracionProyectos/app/lib/kanban/'));
});

gulp.task('fontsBootstap', ['kanbanTemplate'], function () {
    return gulp.src([
        './bower_components/bootstrap/fonts/*',
    ])
        .pipe(gulp.dest('../administracionProyectos/app/fonts/'));
});

gulp.task('fonts', ['fontsBootstap'], function () {
    return gulp.src([
        './app/fonts/fonts-awesome/fonts/*',
    ])
        .pipe(gulp.dest('../administracionProyectos/app/fonts/'));
});

gulp.task('i18n', ['fonts'], function () {
    return gulp.src([
        './app/i18n/**/*'

    ])
        .pipe(gulp.dest('../administracionProyectos/app/i18n/'));
});


gulp.task('build', ['i18n'], function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(htmlreplace({
        'app': 'app/app.min.js'
        	}))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest('../administracionProyectos'));
});

gulp.task('cleanBuild', ['build'], function(cb) {
    del(['./app/dist',
    ], cb);
});


gulp.task('cleanDist', function(cb) {
    del(['../administracionProyectos'
    ], cb);
});

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');
    return gulp.src('src/app/**/*.js')
        .pipe(gulpDocs.process())
        .pipe(gulp.dest('./docs'));
});

/*
 *
 Servidor browserSync
 *
 */
gulp.task('browserSync', function () {
    browserSync.init({
        port: 3005,
        server: ""
    });
});

gulp.task('serve', function (callback) {
    runSequence('browserSync',
            callback
            );
    gulp.watch('app/*', browserSync.reload);

});