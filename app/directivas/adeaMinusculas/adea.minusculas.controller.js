(function() {

	/**
	 * @ngdoc directive
	 * @name xsAdmin.directive:Tabla
	 * @scope
	 * @restrict E
	 * @description Directiva que se encarga del la tabla de registros dentro de
	 *              los mantenimientos, y otors lugares dentor de sistema.
	 */
	angular.module('adeaDirectivas').directive('adeaMinusculas', adeaMinusculas);

	adeaMinusculas.$inject = [];
	

	function adeaMinusculas() {
	    var directiva =  {
	      restrict: 'A',
	      require: 'ngModel',
	      link: function(scope, element, attrs, ctrl) {
	    	  element.on('keypress', function(e) {
		          var char = e.char || String.fromCharCode(e.charCode);
		          if (!/^[0-9a-zA-Z_-\s,.áéíóúÁÉÍÓÚñÑÜü@:\(\)/]*$/i.test(char)) {
		            e.preventDefault();
		            return false;
		          }
		        });

		        function parser(value) {
		          if (ctrl.$isEmpty(value)) {
		            return value;
		          }
		          var formatedValue = value.toLowerCase();
		          if (ctrl.$viewValue !== formatedValue) {
		            ctrl.$setViewValue(formatedValue);
		            ctrl.$render();
		          }
		          return formatedValue;
		        }

		        function formatter(value) {
		          if (ctrl.$isEmpty(value)) {
		            return value;
		          }
		          return value.toLowerCase();
		        }

		        ctrl.$formatters.push(formatter);
		        ctrl.$parsers.push(parser);
	      }
	    	
	   };
	    
	   return directiva;
	}

})();
