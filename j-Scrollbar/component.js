COMPONENT('scrollbar', 'reset:true;margin:0;marginxs:0;maginsm:0;marginmd:0;marginlg:0', function(self, config) {

	self.readonly();

	self.done = function() {

		if (config.parent) {
			var parent = config.parent === 'window' ? $(window) : self.element.closest(config.parent).height();
			self.element.css('height', parent.height() - (config.offset ? self.element.offset().top : 0) - config.margin - config.margin[WIDTH()]);
		}

		self.scrollbar.resize();
	};

	self.on('resize', self.done);

	self.make = function() {
		self.scrollbar = SCROLLBAR(self.element, { visibleX: config.visibleX, visibleY: config.visibleY });
	};

	self.resize = function() {
		self.scrollbar.resize();
	};

	self.scrollLeft = function(val) {
		self.scrollbar.scrollLeft(val);
	};

	self.scrollTop = function(val) {
		self.scrollbar.scrollTop(val);
	};

	self.scroll = function(x, y) {
		self.scrollbar.scroll(x, y);
	};

	self.reset = function() {
		self.scroll(0, 0);
	};

	self.setter = function(value, path, type) {
		type && setTimeout(function() {
			self.done();
			config.reset && self.reset();
		}, 500);
	};

});