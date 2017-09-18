COMPONENT('layer', 'offset:65;container:.ui-layer-body', function(self, config) {

	var visible = false;
	var csspos = {};
	var W = window;

	if (!W.$$layer) {
		W.$$layer_level = W.$$layer_level || 1;
		W.$$layer = true;
		$(W).on('resize', function() {
			setTimeout2('layers', function() {
				var w = $(W).width();
				$('.ui-layer').each(function() {
					var el = $(this);
					el.css('width', (w - config.offset) - (config.offset * (+el.attr('data-index'))));
					el.component().resizecontent();
				});
			}, 100);
		});
	}

	self.readonly();

	self.make = function() {
		self.aclass('ui-layer');
		self.element.prepend('<div class="ui-layer-toolbar"><div class="ui-layer-toolbar-back"><button><i class="fa fa-times"></i></button></div><div class="ui-layer-toolbar-caption">{0}</div></div>'.format(config.title));

		// Move element to safe place
		$(document.body).append('<div id="{0}"></div>'.format(self._id));
		var el = $('#' + self._id);
		el.get(0).appendChild(self.element.get(0));
		self.rclass('hidden');
		self.replace(el.find('.ui-layer'));

		// Toolbar
		self.toolbar = VIRTUALIZE(self, { button: '.ui-layer-toolbar-back > button', title: '.ui-layer-toolbar-caption' });
		self.toolbar.button.event('click', self.hide);

		self.event('click', function() {
			var arr = self.get();
			var index = arr.indexOf(config.if);
			if (index !== -1 && index !== arr.length - 1)
				self.set(arr.slice(0, index + 1));
		});
	};

	self.configure = function(key, value, init) {
		if (init)
			return;
		switch (key) {
			case 'title':
				self.toolbar.title.html(value);
				break;
		}
	};

	self.hide = function() {
		var path = self.get();
		var index = path.indexOf(config.if);
		if (index !== -1) {
			path.splice(index, 1);
			self.refresh(true);
		}
	};

	self.$hide = function() {
		self.rclass('ui-layer-visible');
		self.aclass('hidden', 500);
	};

	self.resizecontent = function() {
		var el = config.container ? self.find(config.container) : EMPTYARRAY;
		if (el.length) {
			var h = $(W).height();
			h = h - self.find('.ui-layer-toolbar').innerHeight();
			el.css('height', h);
			config.resize && EXEC(config.resize, h);
		}
	};

	self.setter = function(value) {

		$('html').tclass('noscroll', value.length > 0);

		var index = value.indexOf(config.if);
		if (index === -1) {
			visible && self.$hide();
			visible = false;
			return;
		}

		var w = $(window).width();

		if (visible) {
			csspos['z-index'] = 10 + index;
			csspos.width = (w - config.offset) - (config.offset * index);
			self.attrd('index', index);
			self.css(csspos);
			setTimeout(self.resizecontent, 100);
			return;
		}

		visible = true;
		csspos['z-index'] = 10 + index;
		csspos.width = (w - config.offset) - (config.offset * index);
		self.css(csspos);
		self.attrd('index', index);
		self.rclass('hidden');
		config.reload && EXEC(config.reload);
		config.default && DEFAULT(config.default, true);

		setTimeout(function() {
			self.aclass('ui-layer-visible');
			setTimeout(self.resizecontent, 100);
		}, 200);
	};
});