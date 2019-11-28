COMPONENT('infinitescroll', 'margin:0;padding:50;autoscroll:100', function(self, config) {

	var cls = 'ui-' + self.name;
	var cls2 = '.' + cls;
	var init = false;
	var isloading = true;
	var css = {};
	var container;

	self.readonly();
	self.blind();

	self.add = function(content) {
		content && self.scrollbar.area.append(content);

		if (typeof(content) === 'string' && content.COMPILABLE())
			COMPILE();

		setTimeout(function() {
			self.scrollbar.area.css('overflow-y', 'scroll');
			self.scrollbar.resize();
			self.scrollbar.area[0].scrollTop += config.autoscroll;
			isloading = false;
		}, 200);
	};

	self.make = function() {
		self.aclass(cls);
		self.element.wrapInner('<div class="{0}-container"></div>'.format(cls));
		container = self.find(cls2 + '-container');
		self.scrollbar = new SCROLLBAR(container, { visibleY: true, onscroll: self.onscroll });
		self.resize();
		setTimeout(function() {
			isloading = false;
			config.exec && EXEC(config.exec, self.add, self.scrollbar.area, true);
		}, 200);
	};

	self.onscroll = function(sb) {
		if (!isloading) {
			var y = sb.area[0].scrollTop + sb.size.viewHeight;
			if (y >= (sb.size.scrollHeight - config.padding)) {
				isloading = true;
				self.scrollbar.area.css('overflow-y', 'hidden');
				config.exec && EXEC(config.exec, self.add, self.scrollbar.area, false);
			}
		}
	};

	self.reset = function() {
		self.scrollbar.scrollTop(0);
		self.refresh();
	};

	self.refresh = function() {
		isloading = true;
		self.scrollbar.resize();
		setTimeout(function() {
			isloading = false;
		}, 200);
	};

	self.resize = function() {

		if (self.release())
			return;

		var el = config.parent ? config.parent === 'window' ? $(W) : config.parent === 'parent' ? self.parent() : self.element.closest(config.parent) : self.parent();
		var h = el.height();
		var w = el.width();

		if (h === 0 || w === 0) {
			self.$waiting && clearTimeout(self.$waiting);
			self.$waiting = setTimeout(self.resize, 234);
			return;
		}

		if (config.margin)
			h -= config.margin;

		css.height = h;
		css.width = self.element.width();
		container.css(css);

		css.width = null;
		self.element.SETTER('*', 'resize');
		self.scrollbar.resize();

		if (!init) {
			self.rclass('invisible', 250);
			init = true;
		}
	};
});