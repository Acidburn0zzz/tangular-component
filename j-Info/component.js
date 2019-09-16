COMPONENT('info', function(self) {

	var cls = 'ui-info';
	var is = false;
	var canhide = false;
	var timeout;
	var events = {};
	var templates = {};

	self.singleton();
	self.readonly();
	self.blind();

	events.scroll = function() {
		events.is && self.forcehide();
	};

	self.make = function() {

		self.aclass(cls + ' hidden');
		self.find('script').each(function() {
			var el = $(this);
			templates[el.attrd('name')] = Tangular.compile(el.html());
		});

		self.event('mouseenter mouseleave', function(e) {
			canhide = e.type === 'mouseleave';
			if (canhide)
				self.hide(500);
			else if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		});

	};

	var ehide = function() {
		canhide && self.hide(100);
	};

	self.bindevents = function() {
		if (events.is)
			return;
		events.is = true;
		$(document).on('touchstart mousedown', ehide);
		$(W).on('scroll', events.scroll);
		ON('scroll', events.scroll);
	};

	self.unbindevents = function() {
		if (!events.is)
			return;
		events.is = false;
		$(document).off('touchstart mousedown', ehide);
		$(W).off('scroll', events.scroll);
		OFF('scroll', events.scroll);
	};

	self.show = function(opt) {

		// opt.align
		// opt.element
		// opt.value
		// opt.name
		// opt.html
		// opt.offsetX
		// opt.offsetY
		// opt.offsetWidth
		// opt.minwidth
		// opt.maxwidth
		// opt.callback
		// opt.class

		var target = opt.element instanceof jQuery ? opt.element[0] : opt.element.element ? opt.element.element[0] : opt.element;

		if (is) {
			clearTimeout(timeout);
			if (self.target === target)
				return self.hide(1);
		}

		if (!opt.align)
			opt.align = 'left';

		self.target = target;
		self.opt = opt;

		target = $(target);

		if (opt.html) {
			self.html(opt.html);
		} else {
			self.element.empty();
			self.element.append(templates[opt.name]({ value: opt.value }));
		}

		if (!opt.minwidth)
			opt.minwidth = 150;

		if (!opt.maxwidth)
			opt.maxwidth = 280;

		self.rclass('hidden');

		opt.class && self.aclass(opt.class);

		var offset = target.offset();
		var options = {};
		var width = self.element.innerWidth() + (opt.offsetWidth || 0);

		if (opt.maxwidth && width > opt.maxwidth)
			options.width = width = opt.maxwidth;

		if (opt.minwidth && width < opt.minwidth)
			options.width = width = opt.minwidth;

		if (width > WW)
			width = WW;

		options.left = (opt.align === 'center' ? Math.ceil(offset.left - ((width / 2) - (target.innerWidth() / 2))) : opt.align === 'left' ? offset.left - 8 : (offset.left - width) + target.innerWidth()) + (opt.offsetX || 0);
		options.top = (opt.position === 'bottom' ? (offset.top - self.element.height() - 10) : (offset.top + target.innerHeight() + 10)) + (opt.offsetY || 0);

		var sum = options.left + width;

		if (sum > WW)
			options.left = WW - width;

		if (options.left < 0)
			options.left = 0;

		self.element.css(options);
		self.bindevents();
		canhide = true;

		if (is)
			return;

		setTimeout(function() {
			self.aclass(cls + '-visible');
		}, 100);

		is = true;
	};

	self.forcehide = function() {

		self.unbindevents();
		self.rclass(cls + '-visible').aclass('hidden', 100);

		if (self.opt) {
			self.opt.class && self.rclass(self.opt.class);
			self.opt.callback && self.opt.callback();
		}

		self.target = null;
		self.opt = null;
		is = false;
	};

	self.hide = function(sleep) {

		if (!is || (!canhide && sleep !== true))
			return;

		if (sleep == true)
			sleep = 1000;

		clearTimeout(timeout);
		timeout = setTimeout(self.forcehide, sleep > 0 ? sleep : 800);
	};
});