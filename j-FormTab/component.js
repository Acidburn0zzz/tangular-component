COMPONENT('formtab', 'width:500;height:400;margin:10;marginfullscreen:20', function(self, config) {

	var cls = 'ui-' + self.name;
	var cls2 = '.' + cls;
	var clsm = 'maximized';
	var skip = false;
	var ismobile = isMOBILE && WIDTH() === 'xs';

	self.readonly();

	self.count = function() {
		return (WW / (self.find(cls2 + '-open').length * config.width)) >> 0;
	};

	self.make = function() {

		var scr = self.find('script');
		self.template = Tangular.compile(scr.html());
		scr.remove();

		$(document.body).append('<div class="{0}" id="{1}"><div class="{0}-layer"></div></div>'.format(cls, self.ID));
		self.replace($('#' + self.ID), true);

		self.event('click', cls2 + '-title', function() {

			var el = $(this);
			var parent = el.parent();

			if (ismobile || parent.hclass(cls + '-' + clsm))
				return;

			var id = parent.attrd('id');
			self.toggle(id);
		});

		self.event('click', cls2 + '-op', function(e) {
			var el = $(this);
			var name = el.attrd('name');
			var id = el.closest(cls2 + '-modal').attrd('id');
			self[name](id);
			e.stopPropagation();
			e.preventDefault();
		});

		self.event('click', 'button,.cancel', function() {

			var t = this;

			if (t.tagName === 'BUTTON' && (!t.name || (t.name !== 'submit' && t.name !== 'cancel')))
				return;

			var el = $(t);
			var scope = el.scope();
			var parent = el.closest(cls2 + '-modal');
			var id = parent.attrd('id');

			if (t.name === 'submit') {
				if (config.submit)
					EXEC(config.submit, self.get().findItem('id', id), scope ? scope.get() : null);
			} else
				self.close(id);
		});

		if (config.enter) {
			self.event('keydown', function(e) {
				if (e.keyCode === 13) {
					setTimeout2(self.ID + 'enter', function() {
						self.find('button[name="submit]').trigger('click');
					}, 500);
				}
			});
		}

		self.resize();

		if (W.OP)
			W.OP.on('resize', self.resize2);
		else
			$(W).on('resize', self.resize2);
	};

	self.resize2 = function() {
		setTimeout2(self.ID, self.resize, 200);
	};

	self.insert = function(obj) {
		var m = self.find(cls2 + '-modal[data-id="{0}"]'.format(obj.id));
		if (!m.length) {

			var maximized = '';

			if (ismobile) {
				maximized = ' ' + cls + '-' + clsm;
				self.aclass(cls + '-ismaximized');
			}

			var scope = self.ID + 'p' + GUID(5);
			var template = '<div data-id="{4}" class="{0}-modal {0}-open{8}"><div class="{0}-title"><i class="fa fa-times {0}-op" data-name="close"></i><i class="fa fa-expand-arrows-alt {0}-op{9}" data-name="maximize"></i><i class="fa fa-minus {0}-op{9}" data-name="minimize"></i><label>{3}</label></div><div class="{0}-body" data-scope="{2}" data-id="{4}" style="width:{5}px;height:{6}px">{7}</div></div>'.format(cls, self.ID, scope, obj.name, obj.id, config.width, config.height, self.template(obj), maximized, ismobile ? ' hidden-xs' : '');

			if (obj.data)
				SETR(scope, CLONE(obj.data));

			self.append(template);
			self.resize2();
			setTimeout2(self.ID + 'compile', COMPILE, 500);
		}
	};

	self.findmodal = function(id) {
		return self.find(cls2 + '-modal[data-id="{0}"]'.format(id));
	};

	self.toggle = function(id) {
		var el = self.findmodal(id);
		el.tclass(cls + '-open');
		self.resize();
		self.emitresize(el);
	};

	self.emitresize = function(el) {
		el.SETTER('*', 'resize');
	};

	self.minimize = function(id) {
		var el = self.findmodal(id);
		if (el.hclass(cls + '-open')) {
			el.rclass(cls + '-open');
			if (el.hclass(cls + '-' + clsm))
				self.maximize(id);
			self.resize();
		} else
			self.toggle(id);
	};

	self.maximize = function(id) {

		var el = self.findmodal(id);

		if (el.hclass(cls + '-' + clsm)) {
			el.rclass(cls + '-' + clsm);
			self.rclass(cls + '-is' + clsm);
		} else {
			el.find(cls2 + '-' + clsm).rclass(clsm);
			el.aclass(cls + '-open ' + cls + '-' + clsm);
			self.aclass(cls + '-is' + clsm);
		}

		self.resize();
		self.emitresize(el);
	};

	self.close = function(id) {
		if (config.onclose) {
			EXEC(config.onclose, self.get().findItem('id', id), function() {
				self.closeforce(id);
			});
		} else
			self.closeforce(id);
	};

	self.closeforce = function(id) {
		var el = self.findmodal(id);
		if (el.length) {
			skip = true;
			if (el.hclass(cls + '-' + clsm))
				self.rclass(cls + '-is' + clsm);
			self.update();
			el.remove();
			FREE();
			self.resize();
		}
	};

	self.resize = function() {

		var wd = WIDTH();
		var mf = (config['marginfullscreen' + wd] || config.marginfullscreen);
		var mn = (config['margin' + wd] || config.margin);
		var m = mf * 2;
		var arr = self.find(cls2 + '-modal');
		var cssa = {};
		var cssb = {};
		var offset = mn;
		var w = $(W).width();

		for (var i = 0; i < arr.length; i++) {
			var el = $(arr[i]);
			var body = el.find(cls2 + '-body');

			if (el.hclass(cls + '-' + clsm)) {
				cssa.width = w - m;
				cssa.height = WH - m;
				cssa.left = cssa.top = mf;
				cssa.right = '';
				cssb.width = cssa.width;
				cssb.height = cssa.height - body.position().top;
			} else {
				cssa.right = offset + 'px';
				cssa.width = cssa.height = cssa.left = cssa.top = '';
				cssb.width = config['width' + wd] || config.width;
				cssb.height = config['height' + wd] || config.height;
			}

			el.css(cssa);
			body.css(cssb);

			if (el.hclass(cls + '-open'))
				offset += config.width + mn;
			else
				offset += el.find(cls2 + '-title').width() + (mn * 2);
		}

		self.css('width', WW);
	};

	self.setter = function(value) {

		if (skip) {
			skip = false;
			return;
		}

		// Remove non-existent
		var arr = self.find(cls2 + '-modal');
		for (var i = 0; i < arr.length; i++) {
			var el = arr[i];
			var id = el.attrd('id');
			if (!value.findItem('id', id))
				self.closeforce(id);
		}

		for (var i = 0; i < value.length; i++)
			self.insert(value[i]);

		self.resize2();
	};
});