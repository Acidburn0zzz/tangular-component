COMPONENT('layer', 'offset:65;scrollbar:true;container:.ui-layer-body', function(self, config) {

	var visible = false;
	var csspos = {};
	var w = window;

	if (!w.$$layer) {
		w.$$layer_level = w.$$layer_level || 1;
		w.$$layer = true;
		$(w).on('resize', function() {
			setTimeout2('layers', function() {
				$('.ui-layer').each(function() {
					var el = $(this);
					el.css('width', (w - config.offset) - (config.offset * (+el.attrd('index'))));
					el.component().resize();
				});
			}, 100);
		});
	}

	self.readonly();

	self.make = function() {

		// Move element to safe place
		$(document.body).append('<div id="{0}" class="ui-layer"><div class="ui-layer-toolbar"><div class="ui-layer-toolbar-back"><button class="ui-layer-toolbar-backbutton"><i class="fa fa-times"></i></button></div><div class="ui-layer-toolbar-caption" data-bind="@config.title__html:value"></div></div><div class="ui-layer-body"></div></div>'.format(self.ID));

		var el = $('#' + self.ID);
		el.find('.ui-layer-body')[0].appendChild(self.dom);
		self.rclass('hidden');
		self.replace(el);
		self.event('click', '.ui-layer-toolbar-backbutton', self.hide);

		var body = el.find('.ui-layer-body');

		if (config.scrollbar && window.SCROLLBAR) {
			self.scrollbar = SCROLLBAR(body, { visibleY: !!config.scrollbarY });
			self.scrollleft = self.scrollbar.scrollLeft;
			self.scrolltop = self.scrollbar.scrollTop;
			self.scrollright = self.scrollbar.scrollRight;
			self.scrollbottom = self.scrollbar.scrollBottom;
		} else
			body.aclass('ui-layer-scroll');

		self.event('click', function() {
			var arr = self.get();
			var index = arr.indexOf(config.if);
			if (index !== -1 && index !== arr.length - 1)
				self.set(arr.slice(0, index + 1));
		});
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

	self.resize = function() {
		var el = config.container ? self.find(config.container) : EMPTYARRAY;
		if (el.length) {
			var h = WH - self.find('.ui-layer-toolbar').innerHeight();
			el.css('height', h);
			config.resize && EXEC(config.resize, h);
		}
		self.scrollbar && self.scrollbar.resize();
	};

	self.setter = function(value) {

		$('html').tclass('ui-layer-noscroll', value.length > 0);

		var index = value.indexOf(config.if);
		if (index === -1) {
			visible && self.$hide();
			visible = false;
			return;
		}

		if (visible) {
			csspos['z-index'] = 10 + index;
			csspos.width = (WW - config.offset) - (config.offset * index);
			self.attrd('index', index);
			self.css(csspos);
			setTimeout(self.resize, 100);
			return;
		}

		visible = true;
		csspos['z-index'] = 10 + index;
		csspos.width = (WW - config.offset) - (config.offset * index);
		self.css(csspos);
		self.attrd('index', index);
		self.rclass('hidden');
		self.resize();
		config.reload && EXEC(config.reload);
		config.default && DEFAULT(config.default, true);

		setTimeout(function() {
			self.aclass('ui-layer-visible');
			setTimeout(self.resize, 100);
		}, 200);
	};
});