(function () {
    angular.module('objetosTabla', [])

    /**
     *
     * @name objetosTabla.value:tblCatalogos
     * @description Objeto con la configuracion de la tabla de catalos
     */
        .value("tblSubProyectos", {
            columnas: [
                {valor: "descEstatus", titulo: "Estatus", alinear: "center"},
                {valor: "nombre", titulo: "Nombre"},
                {valor: "fecIni", titulo: "Fecha Inicio", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "fecFin", titulo: "Fecha Fin", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "fechaCap", titulo: "Fecha Captura", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "nombreLider", titulo: "Lider"},
                {valor: "diferencia", titulo: "Duración (Dias)", alinear: "center"},
                {valor: "descTipoSub", titulo: "Tipo Suproyecto", alinear: "center"},
                {valor: "presupuesto", titulo: "Presupuesto", alinear: "center", filtro:"moneda"},
                {valor: "costo", titulo: "Costo", alinear: "center", filtro:"moneda"}
            ]
        })

        /**
         *
         * @name objetosTabla.value:tblCatalogos
         * @description Objeto con la configuracion de la tabla de registro de pagos
         */
        .value("tblPlantilla", {
            columnas: [
                {valor: "nombre", titulo: "Nombre"},
                {valor: "descPerfil", titulo: "Perfil"},
                {valor: "costo", titulo: "Costo", filtro: "moneda"},
                {valor: "estatus", titulo: "Estatus", filtro: "estatusAccion"},
                {valor: "fechaAlta", titulo: "Fecha de Registro", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "fechaUltimaMod", titulo: "Fecha de Ultima Modificación", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "login", titulo: "Usuario", filtro: "cadenaVacia"},
            ]
        })

        .value("tblActividadesPlan", {
            columnas: [
            	 {valor: "descEstatus", titulo: "Estatus", alinear: "center", filtro: "cadenaVacia"},
                {valor: "nombreActividad", titulo: "Tarea"},
                {valor: "fecIni", titulo: "Fecha Inicio", filtro: "fechaSFecha", alinear: "center"},
                {valor: "fecFin", titulo: "Fecha Fin", filtro: "fechaSFecha", alinear: "center"},
                {valor: "descTicket", titulo: "Ticket", alinear: "center", filtro: "cadenaVacia"},
                {valor: "descArea", titulo: "Area", alinear: "center", filtro: "cadenaVacia"},
                {valor: "porcAvance", titulo: "% Avance", alinear: "center", filtro: "cadenaVacia"},
                {valor: "descPred", titulo: "Predecesora", alinear: "center", filtro: "cadenaVacia"},
                {valor: "dias", titulo: "Duración (Días)", alinear: "center"},
                {valor: "retraso", titulo: "Retraso (Días)", alinear: "center"},
                {valor: "bndRec", titulo: "Asignada", alinear: "center", filtro: "palomaotache"}
                
            ]
        })

        .value("tblMisTickets", {
            columnas: [
                {valor: "idTicket", titulo: "No. Ticket", alinear: "center"},
                {valor: "resumen", titulo: "Resumen"},
                {valor: "fechaAlta", titulo: "Fecha Registro", filtro: "fechaSFecha", alinear: "center"},
                {valor: "descPrioridad", titulo: "Prioridad", alinear: "center"}
            ]
        })
        
        
        .value("tblClientesCompletos", {
            columnas: [
            	{valor: "scltcod", titulo: "No. Cliente", alinear: "center"},
            	{valor: "nombreCli", titulo: "Cliente"},
                {valor: "cartaCompromiso", titulo: "Carta Compromiso", alinear: "center", filtro: "palomaotache"},
                {valor: "alta", titulo: "Alta", alinear: "center", filtro: "palomaotache"},
                {valor: "listaPrecios", titulo: "Lista Precios", alinear: "center", filtro: "palomaotache"},
                {valor: "comprobanteDomicilio", titulo: "Comprobante Domicilio", alinear: "center", filtro: "palomaotache"},
                {valor: "identificacion", titulo: "Identificación", alinear: "center", filtro: "palomaotache"},
                {valor: "actaConstitutiva", titulo: "Acta Constitutiva", alinear: "center", filtro: "palomaotache"},
                {valor: "clausulaIncremento", titulo: "Clausula Incremento", alinear: "center", filtro: "palomaotache"},
                {valor: "r1R2", titulo: "R1 o R2", alinear: "center", filtro: "palomaotache"},
                {valor: "rfc", titulo: "RFC", alinear: "center", filtro: "palomaotache"},
                {valor: "poderNotarial", titulo: "Poder Notarial", alinear: "center", filtro: "palomaotache"},
                {valor: "contrato", titulo: "Contrato", alinear: "center", filtro: "palomaotache"},
                {valor: "poliza", titulo: "Poliza", alinear: "center", filtro: "palomaotache"}              
            ]
        })
        
        .value("tblProyectosDoc", {
            columnas: [
            	{valor: "nombre", titulo: "Proyecto"},
            	{valor: "estatus", titulo: "Estatus", alinear: "center"},
                {valor: "anexo", titulo: "Anexo", alinear: "center", filtro: "palomaotache"},
                {valor: "poliza", titulo: "Poliza", alinear: "center", filtro: "palomaotache"},
                {valor: "convenio", titulo: "Convenio", alinear: "center", filtro: "palomaotache"},
                {valor: "contrato", titulo: "Contrato", alinear: "center", filtro: "palomaotache"},
                {valor: "propuestaTecnica", titulo: "Propuesta Técnica", alinear: "center", filtro: "palomaotache"},
                {valor: "propuestaEconomica", titulo: "Propuesta Económica", alinear: "center", filtro: "palomaotache"}     
            ]
        })
        
        .value("tblReprogramacion", {
            columnas: [
                {valor: "loginUsr", titulo: "Login"},
                {valor: "fecIniAct", titulo: "Fecha Inicio Anterior", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "fecFinAct", titulo: "Fecha Fin Anterior", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "fecCap", titulo: "Fecha Captura", filtro: "date", formato: "dd/MM/yyyy", alinear: "center"},
                {valor: "motivo", titulo: "Motivo"},
            ]
        })
        
        .value("tblClientesCContratos", {
            columnas: [
            	{valor: "scltcod", titulo: "No. Cliente", alinear: "center"},
            	{valor: "acltrzsc", titulo: "Cliente"},
                {valor: "estado", titulo: "Estatus", alinear: "center", filtro: "estatusAccion"},
            	{valor: "fechaVigencia", titulo: "Fecha Vigencia", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"}
            ]
        })
        
        .value("tblClientesContratos", {
            columnas: [
            	{valor: "scltcod", titulo: "No. Cliente", alinear: "center"},
            	{valor: "acltrzsc", titulo: "Cliente"},
                {valor: "estado", titulo: "Estatus", alinear: "center", filtro: "estatusAccion"}
            ]
        })
        
        .value("tblProyectosCContratos", {
            columnas: [
            	{valor: "acltrzsc", titulo: "Nombre Cliente"},
            	{valor: "nombreProyecto", titulo: "Nombre Proyecto"},
                {valor: "numContrato", titulo: "Numero Contrato", alinear: "center"},
                {valor: "fecContrato", titulo: "Fecha Contrato", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
                {valor: "fecVencimiento", titulo: "Fecha Vencimiento", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
                {valor: "tiempoVig", titulo: "Duración", alinear: "center"},
                {valor: "renovacion", titulo: "Renovación", alinear: "center", filtro: "renovacion"},
                {valor: "copia", titulo: "Copia", alinear: "center", filtro:"palomaotacheB"},
                {valor: "montoContrato", titulo: "Monto contrato", alinear: "center", filtro: "moneda"}
            ]
        })
        
        .value("tblProyectosCAnexo", {
            columnas: [
            	{valor: "acltrzsc", titulo: "Nombre Cliente"},
            	{valor: "nombreProyecto", titulo: "Nombre Proyecto"},
                {valor: "nombre", titulo: "Nombre Anexo", alinear: "center"},
                {valor: "fecVencimiento", titulo: "Fecha Vencimiento", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
                {valor: "nomenclatura", titulo: "Nomenclatura", alinear: "center"}
            ]
        })
        
        
        .value("tblProyectosCPoliza", {
            columnas: [
            	{valor: "acltrzsc", titulo: "Nombre Cliente"},
            	{valor: "nombreProyecto", titulo: "Nombre Proyecto"},
                {valor: "tipoPoliza", titulo: "Tipo Poliza", alinear: "center"},
                {valor: "nombre", titulo: "Nombre Poliza", alinear: "center"},
                {valor: "fechaVencimiento", titulo: "Fecha Vencimiento", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"}
            ]
        })
        
        .value("tblClienteCProyecto", {
            columnas: [
            	{valor: "scltcod", titulo: "No. Cliente"},
            	{valor: "nomCliente", titulo: "Nombre Cliente"},
                {valor: "estatus", titulo: "Estatus", alinear: "center"},
                {valor: "noProyectos", titulo: "Número Proyectos", alinear: "center"}
            ]
        })
        
        .value("tblClienteSProyecto", {
            columnas: [
            	{valor: "scltcod", titulo: "No. Cliente"},
            	{valor: "acltrzsc", titulo: "Nombre Cliente"},
                {valor: "estado", titulo: "Estado", alinear: "center"}
            ]
        })
        
         .value("tblDocumentosProyecto", {
            columnas: [
            	{valor: "nombreCliente", titulo: "Cliente"},
            	{valor: "nombreProyecto", titulo: "Proyecto"},
                {valor: "estatus", titulo: "Estatus", alinear: "center", filtro: "estatusAccion"}
            ]
        })
        
        .value("tblContratosVigencias", {
            columnas: [
            	{valor: "nombre", titulo: "Proyecto"},
            	{valor: "nombreCliente", titulo: "Cliente"},
            	{valor: "fechaVig", titulo: "Fecha Vigencia", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
                {valor: "anexos", titulo: "Anexos", alinear: "center"},
            	{valor: "polizas", titulo: "Polizas", alinear: "center"},
            	{valor: "anexosVigentes", titulo: "Anexos Vigentes", alinear: "center"},
            	{valor: "contrAutorenovable", titulo: "Contratos AutoRenovables", alinear: "center"},
            	{valor: "contrCopia", titulo: "Contratos Copia", alinear: "center"},
            	{valor: "contrOriginal", titulo: "Contratos Original", alinear: "center"}
            ]
        })
        
        .value("tblCostosPlantilla", {
            columnas: [
            	{valor: "fecIni", titulo: "Fecha Inicio", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "fecFin", titulo: "Fecha Fin", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
                {valor: "costo", titulo: "Costo", alinear: "center", filtro: "moneda"},
            	{valor: "login", titulo: "Usuario", alinear: "center"}	
            ]
        })
        
         .value("tblRecursosSubproyecto", {
            columnas: [
            	{valor: "nombreActividad", titulo: "Actividad"},
            	{valor: "nombre", titulo: "Nombre"},
            	{valor: "fecIni", titulo: "Fecha Inicio", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "fecFin", titulo: "Fecha Fin", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "horasAsig", titulo: "Horas Asignadas al Día", alinear: "center"},
            	{valor: "dias", titulo: "Duración (Días)", alinear: "center"},
            	{valor: "costoAct", titulo: "Costo", alinear: "center", filtro: "moneda"}
            ]
        })
        
        .value("tblProyectoClienteMonto", {
            columnas: [
            	{valor: "estatus", titulo: "Estatus", filtro: "estatusAccion"},
            	{valor: "nombre", titulo: "Proyecto"},
            	{valor: "fechaAlta", titulo: "Fecha de Alta", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "descOperatoria", titulo: "Operatoria", filtro: "cadenaVacia"},
            	{valor: "noSubproyectos", titulo: "Numero Subproyectos", alinear: "center"},
            	{valor: "monto", titulo: "$ Contrato", filtro: "moneda", alinear: "center",}
            ]
        })
        
         .value("tblIncidencias", {
            columnas: [
            	{valor: "tipo", titulo: "Concepto"},
            	{valor: "fechaCarga", titulo: "Fecha Carga", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "usuarioCargo", titulo: "Usuario"},
            	{valor: "numReg", titulo: "Registros", alinear: "center"},
            	{valor: "bndCarga", titulo: "Estatus", filtro: "palomaotacheT", alinear: "center"},
            	{valor: "mensajeErr", titulo: "Mensaje"}
            ]
        })
        
        
        .value("tblCarteraFac", {
            columnas: [
            	{valor: "descCartera", titulo: "Descripción"},
            	{valor: "descPer", titulo: "Periodo", alinear: "center", filtro: "cadenaVacia"},
            	{valor: "descLay", titulo: "Layout Proceso", alinear: "center", filtro: "cadenaVacia"},
            	{valor: "idProceso", titulo: "Proceso BD", alinear: "center", filtro: "cadenaVacia"},

            ]
        })
        
        .value("tblItemsFac", {
            columnas: [
            	{valor: "estatus", titulo: "Estatus", filtro: "estatusAccion", alinear: "center"},
            	{valor: "descripcion", titulo: "Descripción", filtro: "cadenaVacia"},
            	{valor: "fechaReg", titulo: "Fecha de Registro", alinear: "center", filtro: "date", formato: "dd/MM/yyyy"},
            	{valor: "usuarioReg", titulo: "Usuario Registro", alinear: "center", filtro: "cadenaVacia"},

            ]
        })

        .value("tblCatalogosFac", {
            columnas: [
            	{valor: "estatus", titulo: "Estatus", alinear: "center", filtro: "estatusAccion"},
            	{valor: "codigo", titulo: "Codigo", filtro: "cadenaVacia", alinear: "center"},
            	{valor: "tipo", titulo: "Descripción Tipo", filtro: "cadenaVacia"},
            	{valor: "tablaDet", titulo: "Tabla Soporte", filtro: "cadenaVacia"},
            	{valor: "nombreArc", titulo: "Nombre Archivo"}
            ]
        })
        
         .value("tblPeriodosFacturacion", {
            columnas: [
            	{valor: "fechaEjecucion", titulo: "Fecha Ejecución", filtro: "fecha", alinear: "center"},
            	{valor: "periodo", titulo: "Periodo", filtro: "cadenaVacia", alinear: "center"},
            	{valor: "loginUsr", titulo: "Login", filtro: "cadenaVacia", alinear: "center"},
            	{valor: "bndLayouts", titulo: "Archivos Soporte", filtro: "palomaotache", alinear: "center"}
            ]
        })
        
        .value("tblConfigProforma", {
            columnas: [
            	{valor: "descripcion", titulo: "Item", alinear: "center"},
            	{valor: "tipo", titulo: "Tipo", filtro: "cadenaVacia", alinear: "center"},
            	{valor: "nombreSoporte", titulo: "Soporte", filtro: "cadenaVacia", alinear: "center"},
            	{valor: "unidad", titulo: "Unidad", alinear: "center"},
            	{valor: "precioUnitario", titulo: "Tarifa", alinear: "center", filtro: "moneda"},
            	{valor: "tieneRegla", titulo: "Regla Calculo", alinear: "center", filtro: "palomaotache"}
            ]
        })
        
        .value("tblDetalleTickets", {
            columnas: [
                {valor: "idTicket", titulo: "No. Ticket", alinear: "center"},
                {valor: "resumen", titulo: "Resumen"},
                {valor: "nombreCliente", titulo: "Cliente"},
                {valor: "nombreUsuarioRegistra", titulo: "Solicitante"},
                {valor: "nombreCategoria", titulo: "Categoría"},               
                {valor: "fechaAlta", titulo: "Fecha Registro", filtro: "fechaSFecha", alinear: "center"},
                {valor: "nombreUsuarioAsignado", titulo: "Recurso asignado"},
                {valor: "nombreEstatus", titulo: "Status", alinear: "center"}
            ]
        })

})();
