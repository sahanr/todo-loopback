'use strict';

module.exports = function(Task) {
	Task.validate('name', zradaValidator, {message: 'це зрада'});
	function zradaValidator(err) {
	    if (this.name.toLowerCase().indexOf('зрада') !== -1) err();
	};
};
