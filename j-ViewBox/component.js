COMPONENT('viewbox', 'margin:0;scroll:true;delay:100;scrollbar:false;visibleY:true', function(self, config) {

	var eld, elb;
	var scrollbar;
	var cls = 'ui-viewbox';
	var cls2 = '.' + cls;

	self.readonly();

	self.init = function() {
		var obj;
		if (W.OP)
			obj = W.OP;
		else
			obj = $(W);
		obj.on('resize', function() {
			SETTER('viewbox', 'resize');
		});
	};

	self.configure = function(key, value, init) {
		switch (key) {
			case 'disabled':
				eld.tclass('hidden', !value);
				break;
			case 'minheight':
				!init && self.resize();
				break;
			case 'selector': // backward compatibility
				config.parent = value;
				self.resize();
				break;
		}
	};

	self.make = function() {
		config.scroll && MAIN.version > 17 && self.element.wrapInner('<div class="ui-viewbox-body"></div>');
		self.element.prepend('<div class="ui-viewbox-disabled hidden"></div>');
		eld = self.find('> .ui-viewbox-disabled'.format(cls)).eq(0);
		elb = self.find('> .ui-viewbox-body'.format(cls)).eq(0);
		self.aclass('{0} {0}-hidden'.format(cls));
		if (config.scroll) {
			if (config.scrollbar) {
				if (MAIN.version > 17) {
					scrollbar = window.SCROLLBAR(self.find(cls2 + '-body'), { visibleY: config.visibleY, visibleX: config.visibleX, parent: self.element });
					self.scrollleft = scrollbar.scrollLeft;
					self.scrolltop = scrollbar.scrollTop;
					self.scrollright = scrollbar.scrollRight;
					self.scrollbottom = scrollbar.scrollBottom;
				} else
					self.aclass(cls + '-scroll');
			} else
				self.aclass(cls + '-scroll ' + cls + '-scrollhidden');
		}
		self.resize();
	};

	var css = {};

	self.resize = function() {

		var el = config.parent ? config.parent === 'window' ? $(window) : self.element.closest(config.parent) : self.parent();
		var h = el.height();
		var w = el.width();

		if (h === 0 || w === 0) {
			self.$waiting && clearTimeout(self.$waiting);
			self.$waiting = setTimeout(self.resize, 234);
			return;
		}

		h = ((h / 100) * config.height) - config.margin;

		if (config.minheight && h < config.minheight)
			h = config.minheight;

		css.height = h;
		css.width = self.element.width();

		eld.css(css);

		css.width = null;
		self.css(css);

		if (config.scroll && !config.scrollbar)
			css.width = w + 30;

		elb.length && elb.css(css);
		self.element.SETTER('*', 'resize');
		var c = cls + '-hidden';
		self.hclass(c) && self.rclass(c, 100);

		if (scrollbar)
			scrollbar.resize();
	};

	self.setter = function() {
		setTimeout(self.resize, config.delay);
	};
});