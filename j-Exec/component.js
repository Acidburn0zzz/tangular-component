COMPONENT('exec', function(self) {
	self.readonly();
	self.blind();
	self.make = function() {
		self.event('click', self.attrd('selector') || '.exec', function() {
			var el = $(this);
			var attr = el.attr('data-exec');
			var path = el.attr('data-path');
			attr && EXEC(attr, el);
			path && SET(path, new Function('return ' + el.attr('data-value'))());
		});
	};
});