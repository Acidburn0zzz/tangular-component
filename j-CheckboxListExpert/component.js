COMPONENT('checkboxlistexpert', function(self, config, cls) {

	var cls2 = '.' + cls;
	var template;
	var recompile = false;
	var selected;
	var datasource;
	var reg = /\$(index|path)/g;

	self.nocompile();

	self.configure = function(key, value, init) {

		if (init)
			return;

		switch (key) {
			case 'disabled':
				self.tclass('ui-disabled', value);
				break;
			case 'required':
				self.find(cls2 + '-label').tclass(cls + '-label-required', value);
				break;
			case 'type':
				self.type = config.type;
				break;
			case 'label':
				self.find(cls2 + '-label').html(value);
				break;
			case 'datasource':
				self.datasource(value, self.bind);
				break;
		}

	};

	self.make = function() {
		var builder = [];
		var element = self.find('script');

		if (!element.length)
			return;

		var html = element.html();
		element.remove();
		html = html.replace('>', ' data-value="{{ {0} }}" data-disabled="{{ {1} }}">'.format(config.value || 'id', config.disabledkey || 'disabled'));
		template = Tangular.compile(html);
		recompile = html.COMPILABLE();

		config.label && self.html('<div class="' + cls + '-label{1}">{0}</div>'.format(config.label, config.required ? (' ' + cls + '-label-required') : ''));

		config.datasource && self.reconfigure('datasource:' + config.datasource);
		config.type && (self.type = config.type);
		config.disabled && self.aclass('ui-disabled');

		self.event('click', '[data-value]', function() {
			var el = $(this);
			if (config.disabled || +el.attrd('disabled'))
				return;

			var key = config.value || 'id';
			var value = self.parser(el.attrd('value'));
			var data = self.get();
			var index = -1;
			if (data != null) {
				index = data.findIndex(function(temp) {
					return temp[key] == value;
				});
			}

			if (index === -1) {
				var item = datasource.findItem(function(temp) {
					return temp[key] == value;
				});
				self.push(item);
			}
			else {
				data.splice(index, 1);
				self.set(data);
			}

			self.change(true);
		});
	};

	self.validate = function(value) {
		return config.disabled || !config.required ? true : !!value;
	};

	self.setter = function(value) {

		var key = config.value || 'id';

		if (value && !(value instanceof Array)) {
			var item = datasource.findItem(key, value);
			self.set([item]);
			return;
		}

		self.find('[data-value]').each(function() {
			var el = $(this);
			var data = el.attrd('value');
			var selected = false;
			if (value && value.length) {
				for (var i = 0; i < value.length; i++) {
					if (value[i][key] == data) {
						selected = true;
						break;
					}
				}
			}
			el.tclass('selected', selected);
		});
	};

	self.bind = function(path, arr) {
		if (!arr)
			arr = EMPTYARRAY;

		var builder = [];
		datasource = [];
		var disabledkey = config.disabledkey || 'disabled';

		var type = typeof(arr[0]);
		var notObj = type === 'string' || type === 'number';

		for (var i = 0, length = arr.length; i < length; i++) {
			var item = arr[i];
			item[disabledkey] = +item[disabledkey] || 0;
			datasource.push(item);
			builder.push(template(item).replace(reg, function(text) {
				return text.substring(0, 2) === '$i' ? i.toString() : self.path + '[' + i + ']';
			}));
		}

		render = builder.join('');
		self.find(cls2 + '-container').remove();
		self.append('<div class="{0}-container{1}">{2}</div>'.format(cls, config.class ? ' ' + config.class : '', render));
		self.refresh();
		recompile && self.compile();
	};
});
