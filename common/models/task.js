'use strict';

module.exports = function(Task) {
	Task.validate('name', zradaValidator, {message: 'це зрада'});
	function zradaValidator(err) {
	    if (this.name.toLowerCase().indexOf('зрада') !== -1) err();
	};

	Task.observe('after save', function(ctx, next) {
		if(ctx.isNewInstance){
			Task.app.io.emit('add task', ctx.instance)
		} else {
			Task.app.io.emit('edit task', ctx.instance)
		}
	  next();
	});

	Task.observe('after delete', function (ctx, next) {
		Task.app.io.emit('delete task', ctx.where.id);
		next();
	});

};
