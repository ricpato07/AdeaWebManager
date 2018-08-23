(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas').directive('ngFocus', ngFocus);

	ngFocus.$inject = [ '$log', '$timeout' ];
	function ngFocus($log, $timeout) {

		return {
		    restrict: 'A',
		    scope: {
		    	funcion: '&',
		    },
		    link: function(scope,elem,attrs) {

		      elem.bind('keydown', function(e) {
		        var code = e.keyCode || e.which;
		        if (code === 13) {
		        	
		        	try {
		        		scope.funcion();
		        		$timeout(function(){
		        			if (attrs.tabindex != undefined) {
	                            var currentTabIndex = attrs.tabindex;
	                            var nextTabIndex = parseInt(attrs.tabindex) + 1;
	                            $("[tabindex=" + nextTabIndex + "]").focus();
	                        }
		        	    }, 500);
                        
                    } catch (e) {
                    	console.log(e);
                    }
		        }
		      });
		    }
		  }
	}

})();