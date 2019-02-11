COMPONENT('tree', 'autoreset:false;checkednested:true', function(self, config) {

	var cls = 'ui-tree';
	var cls2 = '.ui-tree';
	var cache = null;
	var counter = 0;
	var expanded = {};
	var selindex = -1;
	var ddfile = null;
	var ddtarget = null;
	var dragged = null;
	self.readonly();
	self.nocompile && self.nocompile();

	self.make = function() {

		self.aclass(cls);
		self.template = Tangular.compile(('<div' + (config.dragdrop ? ' draggable="true"' : '') + ' class="{0}-item{{ if children }} {0}-expand{{ fi }}" title="{{ name }}" data-index="{{ $pointer }}">' + (config.checked ? '<div class="{0}-checkbox"><i class="fa fa-check"></i></div><div class="{0}-label">' : '') + '<i class="far {{ if children }}{0}-folder{{ else }}{{ icon | def(\'fa-file-o\') }}{{ fi }}"></i>' + (config.options ? '<span class="{0}-options"><i class="fa fa-ellipsis-h"></i></span>' : '') + '<div class="{0}-item-name{{ if classname }} {{ classname }}{{ fi }}">{{ name }}</div></div>' + (config.checked ? '</div>' : '')).format(cls));

		self.event('click', cls2 + '-checkbox', function(e) {
			e.stopPropagation();
			var el = $(this);
			var c = cls + '-checkbox-checked';
			el.tclass(c);
			config.checkednested && el.closest(cls2 + '-node').find(cls2 + '-checkbox').tclass(c, el.hclass(c));
			SEEX(config.checked, self.checked(), self);
		});

		self.event('click', cls2 + '-item', function() {
			var el = $(this);
			var index = +el.attrd('index');
			self.select(index);
		});

		self.event('click', cls2 + '-options', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var el = $(this);
			var index = +el.closest(cls2 + 'item').attrd('index');
			config.options && EXEC(config.options, cache[index], el);
		});

		self.event('focusout', 'input', function() {
			var input = $(this);
			var el = input.parent();
			el.html(el[0].$def);
			el[0].$def = null;
		});

		var dragdrop = (config.upload || config.dragdrop);

		dragdrop && self.event('dragenter dragover dragexit drop dragleave dragstart', function (e) {

			if (e.type === 'dragstart') {
				var el = $(e.target);
				if (!el.hclass(cls + '-item'))
					el = el.closest(cls2 + '-item');
				if (el && el.length) {
					e.originalEvent.dataTransfer.setData('text', '1');
					dragged = el;
					return;
				}
				dragged = null;
			}

			e.stopPropagation();
			e.preventDefault();

			switch (e.type) {
				case 'drop':
					break;
				case 'dragenter':
				case 'dragover':
					if (e.target !== ddtarget || (ddtarget && e.target !== ddtarget.parentNode)) {
						ddtarget = e.target;
						ddfile && ddfile.rclass(cls + '-ddhere');
						ddfile = $(ddtarget);
						if (!ddfile.hclass(cls + '-item'))
							ddfile = ddfile.closest(cls2 + '-item');
						ddfile.aclass(cls + '-ddhere');
					}
					return;

				default:
					setTimeout2(self.id, function() {
						ddfile && ddfile.rclass(cls + '-ddhere');
						ddfile = null;
						ddtarget = null;
					}, 100);
					return;
			}

			var index = -1;

			if (e.originalEvent.dataTransfer.files.length) {
				if (ddfile)
					index = +ddfile.attrd('index');
				config.upload && EXEC(config.upload, cache[index], e.originalEvent.dataTransfer.files);
			} else {
				var tmp = $(e.target);
				if (!tmp.hclass(cls + '-item'))
					tmp = tmp.closest(cls2 + '-item');
				tmp.length && config.dragdrop && EXEC(config.dragdrop, cache[+dragged.attrd('index')], cache[+tmp.attrd('index')], dragged, tmp);
				dragged = null;
			}

			ddfile && ddfile.rclass(cls + '-ddhere');
			ddfile = null;
		});

		self.event('keydown', 'input', function(e) {
			if (e.which === 13 || e.which === 27) {
				var input = $(this);
				var el = input.parent();
				if (e.which === 27) {
					// cancel
					el.html(el[0].$def);
					el[0].$def = null;
				} else {
					var val = input.val().replace(/[^a-z0-9.\-_]/gi, '');
					var index = +input.closest(cls2 + '-item').attrd('index');
					var item = cache[index];
					var newname = item.path.substring(0, item.path.length - item.name.length) + val;
					EXEC(config.rename, cache[index], newname, function(is) {
						el.html(is ? val : el[0].$def);
						if (is) {
							item.path = newname;
							item.name = val;
							self.select(index);
						}
					});
				}
			}
		});
	};

	self.select = function(index, noeval) {
		var el = self.find('[data-index="{0}"]'.format(index));
		var c = '-selected';
		if (el.hclass(cls + '-expand')) {
			var parent = el.parent();
			config.unselectexpand && self.find(cls2 + c).rclass(cls + c);
			parent.tclass('ui-tree-show');
			var is = expanded[index] = parent.hclass(cls + '-show');
			!noeval && config.exec && SEEX(config.exec, cache[index], true, is);
		} else {
			!el.hclass(cls + c) && self.find(cls2 + c).rclass(cls + c);
			el.aclass(cls + c);
			!noeval && config.exec && SEEX(config.exec, cache[index], false);
			selindex = index;
		}
	};

	self.checked = function() {
		var items = [];
		self.find(cls2 + '-checkbox-checked').each(function() {
			var item = cache[+$(this).parent().attrd('index')];
			item && items.push(item);
		});
		return items;
	};

	self.rename = function(index) {
		var div = self.find('[data-index="{0}"] .ui-tree-item-name'.format(index));
		if (div[0].$def)
			return;
		div[0].$def = div.html();
		div.html('<input type="text" value="{0}" />'.format(div[0].$def));
		div.find('input').focus();
	};

	self.select2 = function(index) {
		self.expand(index);
		self.select(index, true);
	};

	self.unselect = function() {
		var cls = config.selected;
		self.find('.' + cls).rclass(cls);
	};

	self.clear = function() {
		expanded = {};
		selindex = -1;
	};

	self.expand = function(index) {
		if (index == null) {
			self.find(cls2 + '-expand').each(function() {
				$(this).parent().aclass('show');
			});
		} else {
			self.find('[data-index="{0}"]'.format(index)).each(function() {
				var el = $(this);
				if (el.hclass(cls + '-expand')) {
					// group
					el.parent().aclass(cls + '-show');
				} else {
					// item
					while (true) {
						el = el.closest(cls2 + '-children').prev();
						if (!el.hclass(cls + '-expand'))
							break;
						el.parent().aclass(cls + '-show');
					}
				}
			});
		}
	};

	self.collapse = function(index) {
		if (index == null) {
			self.find(cls2 + '-expand').each(function() {
				$(this).parent().rclass(cls + '-show');
			});
		} else {
			self.find('[data-index="{0}"]'.format(index)).each(function() {
				var el = $(this);
				if (el.hclass(cls + '-expand')) {
					el.parent().rclass(cls + '-show');
				} else {
					while (true) {
						el = el.closest(cls2 + '-children').prev();
						if (!el.hclass(cls + '-expand'))
							break;
						el.parent().rclass(cls + '-show');
					}
				}
			});
		}
	};

	self.renderchildren = function(builder, item, level) {
		builder.push('<div class="{0}-children {0}-children{1}" data-level="{1}">'.format(cls, level));
		item.children.forEach(function(item) {
			counter++;
			item.$pointer = counter;
			cache[counter] = item;
			builder.push('<div class="{0}-node{1}">'.format(cls, expanded[counter] && item.children ? ' ui-tree-show' : ''));
			builder.push(self.template(item));
			item.children && self.renderchildren(builder, item, level + 1);
			builder.push('</div>');
		});
		builder.push('</div>');
	};

	self.reset = function() {
		var cls = config.selected;
		self.find('.' + cls).rclass(cls);
	};

	self.first = function() {
		cache.first && self.select(cache.first.$pointer);
	};

	self.setter = function(value) {

		config.autoreset && self.clear();
		var builder = [];

		counter = 0;
		cache = {};

		value && value.forEach(function(item) {
			counter++;
			item.$pointer = counter;
			cache[counter] = item;
			builder.push('<div class="{0}-node{1}">'.format(cls, expanded[counter] && item.children ? ' ui-tree-show' : '') + self.template(item));
			if (item.children)
				self.renderchildren(builder, item, 1);
			else if (!cache.first)
				cache.first = item;
			builder.push('</div>');
		});

		self.html(builder.join(''));

		if (selindex !== -1) {
			// Disables auto-select when is refreshed
			self.select(selindex, true);
		} else
			config.first !== false && cache.first && setTimeout(self.first, 100);

		config.checked && EXEC(config.checked, EMPTYARRAY, self);
	};
});