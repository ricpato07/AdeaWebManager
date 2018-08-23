(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas').directive('ignoreDirty', ignoreDirty);

	ignoreDirty.$inject = [ '$log', '$timeout' ];
	function ignoreDirty($log, $timeout) {
		return {
		    restrict: 'A',
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		    	$log.info('directiva ignore');
		    
		    	/*ctrl.$setPristine = function() {};
		    	ctrl.$pristine = false;*/
		    	ctrl.$valid = true;
		    }
		}
	}
})();