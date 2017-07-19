COMPONENT('lazyload', function(self) {

	var selector, container, offset, is;

	self.readonly();

	self.make = function() {
		selector = self.attr('selector');
		offset = +(self.attr('offset') || 50);
		container = $(self.attr('container') || window);
		is = container.get(0) === window;
		container.on('scroll', self.refresh);
		setTimeout(function() {
			self.refresh();
		}, 1000);
	};

	self.refresh = function() {
		!self.release() && setTimeout2(self.id, self.prepare, 200);
	};

	self.released = self.refresh;
	self.setter = self.refresh;

	self.prepare = function() {
		var scroll = container.scrollTop();
		var beg = scroll - offset;
		var end = beg + container.height() + offset;
		self.find(selector).each(function() {
			if (this.getAttribute('data-lazyload'))
				return;
			var el = $(this);
			var top = (is ? 0 : scroll) + el.offset().top;
			if (top >= beg && top <= end) {
				el.attr('data-lazyload', true);
				EXEC(self.attr('exec'), el);
			}
		});
	};
});