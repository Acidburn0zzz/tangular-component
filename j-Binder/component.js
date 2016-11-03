COMPONENT('binder', function() {

	var self = this;
	var keys;
	var keys_unique;

	self.readonly();
	self.blind();

	self.make = function() {
		self.watch('*', self.autobind);
		self.scan();

		self.on('component', function() {
			setTimeout2(self.id, self.scan, 200);
		});

		self.on('destroy', function() {
			setTimeout2(self.id, self.scan, 200);
		});
	};

	self.autobind = function(path, value) {
		var mapper = keys[path];
		var template = {};
		mapper && mapper.forEach(function(item) {
			var value = self.get(item.path);
			template.value = value;
			item.classes && classes(item.element, item.classes(value));
			item.visible && item.element.toggleClass('hidden', item.visible(value) ? false : true);
			item.content && item.element.html(item.content(value));
			item.template && item.element.html(item.template(template));
		});
	};

	function classes(element, val) {
		var add = '';
		var rem = '';
		val.split(' ').forEach(function(item) {
			switch (item.substring(0, 1)) {
				case '+':
					add += (add ? ' ' : '') + item.substring(1);
					break;
				case '-':
					rem += (rem ? ' ' : '') + item.substring(1);
					break;
				default:
					add += (add ? ' ' : '') + item;
					break;
			}
		});
		rem && element.removeClass(rem);
		add && element.addClass(add);
	}

	function decode(val) {
		return val.replace(/\&\#39;/g, '\'');
	}

	self.scan = function() {
		keys = {};
		keys_unique = {};
		self.find('[data-binder]').each(function() {

			var el = $(this);
			var path = el.attr('data-binder');
			var arr = path.split('.');
			var p = '';

			var classes = el.attr('data-binder-class');
			var content = el.attr('data-binder-content');
			var visible = el.attr('data-binder-visible');
			var obj = el.data('data-binder');

			keys_unique[path] = true;

			if (!obj) {
				obj = {};
				obj.path = path;
				obj.element = el;
				obj.classes = classes ? FN(decode(classes)) : undefined;
				obj.content = content ? FN(decode(content)) : undefined;
				obj.visible = visible ? FN(decode(visible)) : undefined;

				var tmp = el.find('script[type="text/html"]');
				var str = '';
				if (tmp.length)
					str = tmp.html();
				else
					str = el.html();

				if (str.indexOf('{{') !== -1) {
					obj.template = Tangular.compile(str);
					tmp.length && tmp.remove();
				}

				el.data('data-binder', obj);
			}

			for (var i = 0, length = arr.length; i < length; i++) {
				p += (p ? '.' : '') + arr[i];
				if (keys[p])
					keys[p].push(obj);
				else
					keys[p] = [obj];
			}

		});

		Object.keys(keys_unique).forEach(function(key) {
			self.autobind(key, self.get(key));
		});

		return self;
	};

});
