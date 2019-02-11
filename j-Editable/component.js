COMPONENT('editable', function(self, config) {

	var cls = 'ui-editable';
	var events = {};

	self.readonly();

	self.make = function() {

		self.aclass(cls);
		self.event('click', '[data-editable]', function() {

			var t = this;

			if (t.$editable && t.$editable.is)
				return;

			var el = $(t);
			var opt = (el.attrd('editable') || '').parseConfig();

			if (!opt.path) {
				// Internal hack for data-bind instance
				var binder = el[0].$jcbind;
				if (!binder)
					return;
				opt.path = binder.path;
			} else
				opt.path = self.path + '.' + opt.path;

			opt.html = el.html();
			opt.value = GET(opt.path) || el.text();

			if (opt.type)
				opt.type = opt.type.toLowerCase();

			if (opt.type === 'date' && !opt.format)
				opt.format = config.dateformat || 'yyyy-MM-dd';

			if ((opt.can && !GET(opt.can)(opt, el)) || (config.can && !GET(config.can)(opt, el)))
				return;

			opt.is = true;
			t.$editable = opt;

			if (opt.dirsource) {

				if (!opt.dirvalue)
					opt.dirvalue = 'id';

				var attr = {};
				attr.element = el;
				attr.items = GET(opt.dirsource);
				attr.offsetY = -1;
				attr.placeholder = opt.dirplaceholder;
				attr.render = opt.dirrender ? GET(opt.dirrender) : null;
				attr.custom = !!opt.dircustom;
				attr.offsetWidth = 2;
				attr.minwidth = opt.dirminwidth || 200;
				attr.maxwidth = opt.dirmaxwidth;
				attr.key = opt.dirkey || 'name';
				attr.empty = opt.dirempty;

				var val = self.get();

				attr.exclude = function(item) {
					return item ? typeof(item) === 'string' ? item === val : item[opt.dirvalue || 'id'] === val : false;
				};

				attr.close = function() {
					opt.is = false;
					el[0].$editable = null;
				};

				attr.callback = function(item, el, custom) {

					// empty
					if (item == null)
						return;

					var val = custom || typeof(item) === 'string' ? item : item[opt.dirvalue];
					if (custom && typeof(attr.dircustom) === 'string') {
						var fn = GET(attr.dircustom);
						fn(val, function(val) {
							if (val) {
								if (typeof(val) === 'string') {
									opt.value = val;
									el.html(val);
								} else {
									opt.value = item[opt.dirvalue];
									el.html(val[attr.key]);
								}
								self.approve2(val);
							}
						});
					} else if (!custom) {
						opt.value = val;
						el.html(typeof(item) === 'string' ? item : item[attr.key]);
						self.approve2(el);
					}
				};

				SETTER('directory', 'show', attr);

			} else
				self.attach(el);
		});

		events.keydown = function(e) {

			if (!this.$events)
				return;

			if ((e.metaKey || e.ctrlKey) && (e.which === 66 || e.which === 76 || e.which === 73 || e.which === 85)) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (e.which === 27) {
				self.detach($(this));
				return;
			}

			if (e.which === 13 || e.which === 9) {
				var el = $(this);
				self.approve(el);
				self.detach(el);

				if (e.which === 9) {
					var arr = self.find('[data-editable]');
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] === this) {
							var next = arr[i + 1];
							if (next) {
								$(next).trigger('click');
								e.preventDefault();
							}
							break;
						}
					}
				}
			}
		};

		events.blur = function() {
			if (this.$events) {
				var el = $(this);
				self.approve(el);
				self.detach(el);
			}
		};

		events.paste = function(e) {
			e.preventDefault();
			e.stopPropagation();
			var text = e.originalEvent.clipboardData.getData(self.attrd('clipboard') || 'text/plain');
			text && document.execCommand('insertText', false, text);
		};

		events.focus = function() {
			var t = this;
			if (t.$editable && t.$editable.is && t.$editable.autosource) {
				var attr = t.$editable;
				var opt = {};
				opt.element = $(t);
				opt.search = GET(attr.autosource);
				opt.offsetY = 10;
				opt.callback = function(item, el) {
					attr.value = typeof(item) === 'string' ? item : item[attr.autovalue || 'name'];
					el.html(attr.value);
					self.approve2(el);
				};
				SETTER('autocomplete', 'show', opt);
			}
		};
	};

	self.approve = function(el) {

		var opt = el[0].$editable;
		var val = el.text();

		if (opt.html === el.html())
			return;

		opt.value = val;

		switch (opt.type) {
			case 'number':
				opt.value = opt.value.parseFloat();
				break;
			case 'date':
				SETTER('!datepicker', 'hide');
				opt.value = opt.value ? opt.value.parseDate(opt.format) : null;
				break;
		}

		SETTER('!autocomplete', 'hide');

		if (opt.required && !opt.value)
			return;

		opt.html = '';
		self.approve2(el);
	};

	self.approve2 = function(el) {
		var opt = el[0].$editable;
		if (opt.save) {
			GET(opt.save)(opt, function(is) {
				el.html(is || is == null ? opt.value : opt.html);
			});
		} else {
			setTimeout(function() {
				var b = null;
				if (el.binder)
					b = el.binder();
				if (b)
					b.disabled = true;
				SET(opt.path, opt.value);
				self.change(true);
				b && setTimeout(function() {
					b.disabled = false;
				}, 100);
			}, 100);
		}
	};

	self.attach = function(el) {
		if (!el[0].$events) {

			var o = el[0].$editable;
			el[0].$events = true;

			el.aclass('editable-editing');
			el.on('focus', events.focus);
			el.on('keydown', events.keydown);
			el.on('blur', events.blur);
			el.on('paste', events.paste);
			el.attr('contenteditable', true);
			el.focus();

			if (o.type === 'date') {
				var opt = {};
				opt.element = el;
				opt.value = typeof(o.value) === 'string' ? o.value.parseDate(o.format) : o.value;
				opt.callback = function(date) {
					el.html(date.format(o.format));
					self.approve(el);
				};
				SETTER('datepicker', 'show', opt);
			}
		}
	};

	self.detach = function(el) {
		if (el[0].$events) {
			el.off('keydown', events.keydown);
			el.off('blur', events.blur);
			el.off('paste', events.paste);
			el[0].$events = false;
			var opt = el[0].$editable;
			opt.html && el.html(opt.html);
			opt.is = false;
			el.rclass('editable-editing');
			el.attr('contenteditable', false);
		}
	};

});